-- ============================================================
-- 1. 环境初始化 & 数据库创建
-- ============================================================
DROP DATABASE IF EXISTS epms_final_db;
CREATE DATABASE epms_final_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE epms_final_db;

SET FOREIGN_KEY_CHECKS = 0; -- 临时关闭外键检查

-- ============================================================
-- 2. 数据表定义 (DDL) - 含索引优化
-- ============================================================

-- [基础表] 部门信息
CREATE TABLE department (
                            dept_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '部门编号',
                            dept_name VARCHAR(50) NOT NULL UNIQUE COMMENT '部门名称',
                            location VARCHAR(100) COMMENT '地址'
) ENGINE=InnoDB COMMENT='部门表';

-- [基础表] 职位信息 (含薪资基准)
CREATE TABLE position (
                          pos_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '职位编号',
                          pos_name VARCHAR(50) NOT NULL UNIQUE COMMENT '职位名称',
                          base_salary DECIMAL(10, 2) DEFAULT 0.00 COMMENT '基本工资',
                          level VARCHAR(20) COMMENT '职级'
) ENGINE=InnoDB COMMENT='职位表';

-- [核心表] 员工档案 (功能①)
CREATE TABLE employee (
                          emp_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '员工工号',
                          dept_id INT COMMENT '所属部门',
                          pos_id INT COMMENT '当前职位',
                          name VARCHAR(50) NOT NULL COMMENT '姓名',
                          gender ENUM('男', '女') DEFAULT '男',
                          id_card VARCHAR(18) NOT NULL UNIQUE COMMENT '身份证号',
                          phone VARCHAR(20) COMMENT '电话',
                          politics_status VARCHAR(20) COMMENT '政治面貌',
                          hukou_type VARCHAR(20) COMMENT '户口状况',
                          hire_date DATE NOT NULL COMMENT '入职日期',
                          status ENUM('试用期', '在职', '离职') DEFAULT '试用期' COMMENT '状态',

                          INDEX idx_emp_name (name),

                          CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES department (dept_id) ON DELETE SET NULL,
                          CONSTRAINT fk_emp_pos FOREIGN KEY (pos_id) REFERENCES position (pos_id) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='员工档案主表';

-- [功能①] 合同管理
CREATE TABLE contract (
                          contract_id INT AUTO_INCREMENT PRIMARY KEY,
                          emp_id INT NOT NULL,
                          type ENUM('固定期限', '无固定期限', '实习') NOT NULL,
                          start_date DATE NOT NULL,
                          end_date DATE,
                          status ENUM('有效', '过期', '解除') DEFAULT '有效',

                          INDEX idx_contract_alert (status, end_date),

                          CONSTRAINT fk_contract_emp FOREIGN KEY (emp_id) REFERENCES employee (emp_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='合同信息表';

-- [功能②] 考勤管理
CREATE TABLE attendance (
                            record_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            emp_id INT NOT NULL,
                            work_date DATE NOT NULL,
                            type ENUM('正常', '迟到', '早退', '旷工', '请假', '出差') NOT NULL,
                            hours DECIMAL(4, 1) DEFAULT 8.0 COMMENT '时长',
                            remarks VARCHAR(100),

                            INDEX idx_att_emp_date (emp_id, work_date),

                            CONSTRAINT fk_att_emp FOREIGN KEY (emp_id) REFERENCES employee (emp_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='考勤记录表';

-- [功能④] 考核奖惩
CREATE TABLE reward_punish (
                               rp_id INT AUTO_INCREMENT PRIMARY KEY,
                               emp_id INT NOT NULL,
                               type ENUM('奖励', '惩罚') NOT NULL,
                               amount DECIMAL(10, 2) DEFAULT 0.00 COMMENT '金额(正负)',
                               event_date DATE NOT NULL,
                               reason VARCHAR(255) COMMENT '原因',

                               INDEX idx_rp_emp_date (emp_id, event_date),

                               CONSTRAINT fk_rp_emp FOREIGN KEY (emp_id) REFERENCES employee (emp_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='奖惩记录表';

-- [功能③] 人事变动 (历史记录表)
CREATE TABLE job_change (
                            change_id INT AUTO_INCREMENT PRIMARY KEY,
                            emp_id INT NOT NULL,
                            change_type ENUM('入职', '转正', '调动', '晋升', '离职') NOT NULL,
                            old_dept_name VARCHAR(50) COMMENT '原部门快照',
                            new_dept_name VARCHAR(50) COMMENT '新部门快照',
                            old_pos_name VARCHAR(50) COMMENT '原职位快照',
                            new_pos_name VARCHAR(50) COMMENT '新职位快照',
                            change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                            remarks VARCHAR(255) COMMENT '备注说明',

                            INDEX idx_change_log (emp_id, change_date),

                            CONSTRAINT fk_jc_emp FOREIGN KEY (emp_id) REFERENCES employee (emp_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='人事变动日志表';

-- [功能⑤] 员工培训 - 课程表
CREATE TABLE training_course (
                                 course_id INT AUTO_INCREMENT PRIMARY KEY,
                                 course_name VARCHAR(100) NOT NULL,
                                 start_time DATETIME NOT NULL,
                                 end_time DATETIME NOT NULL,
                                 location VARCHAR(100),
                                 trainer VARCHAR(50)
) ENGINE=InnoDB COMMENT='培训课程表';

-- [功能⑤] 员工培训 - 关联表 (M:N关系)
CREATE TABLE emp_training_relation (
                                       emp_id INT NOT NULL,
                                       course_id INT NOT NULL,
                                       score DECIMAL(5, 2) COMMENT '考核成绩',
                                       is_completed BOOLEAN DEFAULT FALSE,
                                       PRIMARY KEY (emp_id, course_id),
                                       CONSTRAINT fk_etr_emp FOREIGN KEY (emp_id) REFERENCES employee (emp_id) ON DELETE CASCADE,
                                       CONSTRAINT fk_etr_course FOREIGN KEY (course_id) REFERENCES training_course (course_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='培训记录中间表';

-- [功能⑥] 系统维护
CREATE TABLE sys_user (
                          user_id INT AUTO_INCREMENT PRIMARY KEY,
                          username VARCHAR(50) NOT NULL UNIQUE,
                          password VARCHAR(100) NOT NULL,
                          role ENUM('ADMIN', 'HR') DEFAULT 'ADMIN',
                          related_emp_id INT UNIQUE,
                          CONSTRAINT fk_sys_emp FOREIGN KEY (related_emp_id) REFERENCES employee (emp_id) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='系统用户表';


-- ============================================================
-- 3. 数据库理论核心实现 (视图、触发器、存储过程)
-- ============================================================

-- ------------------------------------------------------------
-- 3.1 [视图 View] - 实现数据安全性
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_emp_safe_profile AS
SELECT
    e.emp_id,
    e.dept_id,
    e.pos_id,
    e.name,
    e.gender,
    e.phone,
    e.hire_date,
    e.status,
    d.dept_name,
    p.pos_name,
    INSERT(e.id_card, 5, 10, '**********') AS safe_id_card
FROM employee e
         LEFT JOIN department d ON e.dept_id = d.dept_id
         LEFT JOIN position p ON e.pos_id = p.pos_id;


-- ------------------------------------------------------------
-- 3.2 [触发器 Trigger] - 实现业务逻辑自动化与审计
-- ------------------------------------------------------------
DELIMITER //
DROP TRIGGER IF EXISTS trg_log_entry;
CREATE TRIGGER trg_log_entry
    AFTER INSERT ON employee
    FOR EACH ROW
BEGIN
    -- 变量声明
    DECLARE v_dept_name VARCHAR(50);
    DECLARE v_pos_name VARCHAR(50);

    -- 1. 获取新员工的部门和职位名称快照
    SELECT dept_name INTO v_dept_name FROM department WHERE dept_id = NEW.dept_id;
    SELECT pos_name INTO v_pos_name FROM position WHERE pos_id = NEW.pos_id;

    -- 2. 插入一条“入职”记录到人事变动表
    -- 入职时，原部门/原职位为空，只有新部门/新职位
    INSERT INTO job_change (
        emp_id, change_type,
        new_dept_name, new_pos_name,
        change_date, remarks
    )
    VALUES (
               NEW.emp_id, '入职',
               v_dept_name, v_pos_name,
               NOW(), '新员工入职办理'
           );
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS trg_log_job_change;
CREATE TRIGGER trg_log_job_change
    AFTER UPDATE ON employee
    FOR EACH ROW
BEGIN
    -- 变量声明：用于存储名称快照
    DECLARE v_old_dept VARCHAR(50);
    DECLARE v_new_dept VARCHAR(50);
    DECLARE v_old_pos VARCHAR(50);
    DECLARE v_new_pos VARCHAR(50);

    -- 预先查询部门和职位名称（因为下面多个判断可能都要用到）
    -- 只有当ID发生变化时才去查数据库，减少性能开销
    IF OLD.dept_id != NEW.dept_id OR OLD.pos_id != NEW.pos_id THEN
        SELECT dept_name INTO v_old_dept FROM department WHERE dept_id = OLD.dept_id;
        SELECT dept_name INTO v_new_dept FROM department WHERE dept_id = NEW.dept_id;
        SELECT pos_name INTO v_old_pos FROM position WHERE pos_id = OLD.pos_id;
        SELECT pos_name INTO v_new_pos FROM position WHERE pos_id = NEW.pos_id;
    ELSE
        -- 如果ID没变，名称沿用旧的（为了记录完整性，防止插入NULL）
        -- 这里其实也可以再次查询，或者留空。为了报表好看，建议补全。
        SELECT dept_name INTO v_old_dept FROM department WHERE dept_id = OLD.dept_id;
        SET v_new_dept = v_old_dept;
        SELECT pos_name INTO v_old_pos FROM position WHERE pos_id = OLD.pos_id;
        SET v_new_pos = v_old_pos;
    END IF;

    -- ==========================================================
    -- 逻辑分支 A: 状态变更类 (转正、离职)
    -- ==========================================================

    -- 场景1: 转正 (试用期 -> 在职)
    IF OLD.status = '试用期' AND NEW.status = '在职' THEN
        INSERT INTO job_change (emp_id, change_type, old_dept_name, new_dept_name, old_pos_name, new_pos_name, change_date, remarks)
        VALUES (NEW.emp_id, '转正', v_old_dept, v_new_dept, v_old_pos, v_new_pos, NOW(), '试用期通过');
    END IF;

    -- 场景2: 离职 (非离职 -> 离职)
    IF OLD.status != '离职' AND NEW.status = '离职' THEN
        INSERT INTO job_change (emp_id, change_type, old_dept_name, new_dept_name, old_pos_name, new_pos_name, change_date, remarks)
        VALUES (NEW.emp_id, '离职', v_old_dept, NULL, v_old_pos, NULL, NOW(), '员工离职');
    END IF;

    -- ==========================================================
    -- 逻辑分支 B: 岗位/部门变更类 (调动、晋升)
    -- 注意：如果是离职操作，通常不需要再记录一次调动/晋升，所以加一个状态判断
    -- ==========================================================

    IF NEW.status != '离职' THEN

        -- 场景3: 调动 (部门 ID 发生变化)
        -- 规则：员工由一个部门变到另一个部门（无论职位如何变化），都视为调动
        IF OLD.dept_id != NEW.dept_id THEN
            INSERT INTO job_change (emp_id, change_type, old_dept_name, new_dept_name, old_pos_name, new_pos_name, change_date, remarks)
            VALUES (NEW.emp_id, '调动', v_old_dept, v_new_dept, v_old_pos, v_new_pos, NOW(), '跨部门调动');

            -- 场景4: 晋升 (部门不变，但职位 ID 发生变化)
            -- 规则：部门内同职级对应只有一个职位名称，所以职位变动等同于职级变动
        ELSEIF OLD.dept_id = NEW.dept_id AND OLD.pos_id != NEW.pos_id THEN
            INSERT INTO job_change (emp_id, change_type, old_dept_name, new_dept_name, old_pos_name, new_pos_name, change_date, remarks)
            VALUES (NEW.emp_id, '晋升', v_old_dept, v_new_dept, v_old_pos, v_new_pos, NOW(), '部门内职位调整/晋升');
        END IF;

    END IF;

END //
DELIMITER ;


-- ------------------------------------------------------------
-- 3.3 [存储过程 Stored Procedure] - 复杂业务计算
-- 场景：计算员工月度工资。逻辑：基本工资 + 奖惩总额 - (迟到次数 * 50)
-- ------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE sp_calc_monthly_salary(IN p_month VARCHAR(7))
BEGIN
    -- 这是一个复杂的汇总查询，体现了数据库处理数据的能力
    SELECT
        e.emp_id,
        e.name,
        p.base_salary AS '基本工资',

        -- 子查询计算奖惩总额 (COALESCE处理NULL)
        COALESCE((SELECT SUM(amount) FROM reward_punish rp
                  WHERE rp.emp_id = e.emp_id AND DATE_FORMAT(rp.event_date, '%Y-%m') = p_month), 0) AS '奖惩绩效',

        -- 子查询计算考勤扣款 (假设迟到一次扣50)
        (SELECT COUNT(*) FROM attendance a
         WHERE a.emp_id = e.emp_id AND a.type = '迟到' AND DATE_FORMAT(a.work_date, '%Y-%m') = p_month) * 50.00 AS '考勤扣款',

        -- 计算最终实发
        (p.base_salary +
         COALESCE((SELECT SUM(amount) FROM reward_punish rp WHERE rp.emp_id = e.emp_id AND DATE_FORMAT(rp.event_date, '%Y-%m') = p_month), 0) -
         (SELECT COUNT(*) FROM attendance a WHERE a.emp_id = e.emp_id AND a.type = '迟到' AND DATE_FORMAT(a.work_date, '%Y-%m') = p_month) * 50.00
            ) AS '实发工资'

    FROM employee e
             JOIN position p ON e.pos_id = p.pos_id
    WHERE e.status != '离职';
END //
DELIMITER ;


-- ============================================================
-- 4. 数据库功能增强 - 更多视图、函数、存储过程
-- ============================================================

-- ------------------------------------------------------------
-- 4.1 [视图扩展] - 统计分析与业务支持
-- ------------------------------------------------------------

-- 视图2: 部门员工统计视图
CREATE OR REPLACE VIEW v_dept_employee_stats AS
SELECT 
    d.dept_id,
    d.dept_name,
    d.location,
    COUNT(e.emp_id) AS total_employees,
    COUNT(CASE WHEN e.status = '在职' THEN 1 END) AS active_employees,
    COUNT(CASE WHEN e.status = '试用期' THEN 1 END) AS probation_employees,
    COUNT(CASE WHEN e.status = '离职' THEN 1 END) AS resigned_employees,
    IFNULL(AVG(p.base_salary), 0) AS avg_dept_salary,
    MAX(p.base_salary) AS max_dept_salary,
    MIN(p.base_salary) AS min_dept_salary
FROM department d
LEFT JOIN employee e ON d.dept_id = e.dept_id
LEFT JOIN position p ON e.pos_id = p.pos_id
GROUP BY d.dept_id, d.dept_name, d.location;

-- 视图3: 合同到期预警视图（30天内）
CREATE OR REPLACE VIEW v_contract_expiring_soon AS
SELECT 
    c.contract_id,
    e.emp_id,
    e.name AS emp_name,
    d.dept_name,
    p.pos_name,
    c.type AS contract_type,
    c.start_date,
    c.end_date,
    DATEDIFF(c.end_date, CURDATE()) AS days_remaining,
    CASE 
        WHEN DATEDIFF(c.end_date, CURDATE()) <= 7 THEN '紧急'
        WHEN DATEDIFF(c.end_date, CURDATE()) <= 15 THEN '重要'
        ELSE '注意'
    END AS alert_level
FROM contract c
JOIN employee e ON c.emp_id = e.emp_id
LEFT JOIN department d ON e.dept_id = d.dept_id
LEFT JOIN position p ON e.pos_id = p.pos_id
WHERE c.status = '有效' 
  AND c.end_date IS NOT NULL
  AND DATEDIFF(c.end_date, CURDATE()) BETWEEN 0 AND 30
ORDER BY days_remaining;

-- 视图4: 月度考勤异常统计视图
CREATE OR REPLACE VIEW v_attendance_monthly_stats AS
SELECT 
    e.emp_id,
    e.name,
    d.dept_name,
    DATE_FORMAT(a.work_date, '%Y-%m') AS month,
    COUNT(*) AS total_records,
    COUNT(CASE WHEN a.type = '正常' THEN 1 END) AS normal_days,
    COUNT(CASE WHEN a.type = '迟到' THEN 1 END) AS late_count,
    COUNT(CASE WHEN a.type = '早退' THEN 1 END) AS early_leave_count,
    COUNT(CASE WHEN a.type = '旷工' THEN 1 END) AS absence_count,
    COUNT(CASE WHEN a.type = '请假' THEN 1 END) AS leave_count,
    COUNT(CASE WHEN a.type = '出差' THEN 1 END) AS business_trip_count,
    SUM(a.hours) AS total_hours,
    COUNT(CASE WHEN a.type IN ('迟到', '早退', '旷工') THEN 1 END) AS abnormal_count
FROM employee e
LEFT JOIN department d ON e.dept_id = d.dept_id
LEFT JOIN attendance a ON e.emp_id = a.emp_id
WHERE e.status IN ('在职', '试用期')
GROUP BY e.emp_id, e.name, d.dept_name, month
HAVING month IS NOT NULL;

-- 视图5: 员工综合信息视图（含工资、部门统计）
CREATE OR REPLACE VIEW v_employee_comprehensive AS
SELECT 
    e.emp_id,
    e.name,
    e.gender,
    e.phone,
    e.hire_date,
    e.status,
    d.dept_name,
    p.pos_name,
    p.base_salary,
    p.level,
    TIMESTAMPDIFF(MONTH, e.hire_date, CURDATE()) AS work_months,
    TIMESTAMPDIFF(YEAR, e.hire_date, CURDATE()) AS work_years,
    -- 合同信息
    (SELECT COUNT(*) FROM contract WHERE emp_id = e.emp_id) AS contract_count,
    (SELECT MAX(end_date) FROM contract WHERE emp_id = e.emp_id AND status = '有效') AS current_contract_end,
    -- 考勤统计（最近30天）
    (SELECT COUNT(*) FROM attendance 
     WHERE emp_id = e.emp_id 
     AND work_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS recent_attendance_count,
    -- 培训统计
    (SELECT COUNT(*) FROM emp_training_relation WHERE emp_id = e.emp_id) AS training_count,
    (SELECT COUNT(*) FROM emp_training_relation WHERE emp_id = e.emp_id AND is_completed = TRUE) AS completed_training_count
FROM employee e
LEFT JOIN department d ON e.dept_id = d.dept_id
LEFT JOIN position p ON e.pos_id = p.pos_id;


-- ------------------------------------------------------------
-- 4.2 [自定义函数] - 业务计算封装
-- ------------------------------------------------------------

-- 函数1: 计算员工工龄（年）
DELIMITER //
DROP FUNCTION IF EXISTS fn_calc_work_years;
CREATE FUNCTION fn_calc_work_years(p_emp_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE hire_dt DATE;
    DECLARE years DECIMAL(5,2);
    
    SELECT hire_date INTO hire_dt FROM employee WHERE emp_id = p_emp_id;
    
    IF hire_dt IS NULL THEN
        RETURN 0;
    END IF;
    
    SET years = TIMESTAMPDIFF(MONTH, hire_dt, CURDATE()) / 12.0;
    RETURN years;
END //
DELIMITER ;

-- 函数2: 获取员工级别（基于工龄）
DELIMITER //
DROP FUNCTION IF EXISTS fn_get_employee_grade;
CREATE FUNCTION fn_get_employee_grade(p_emp_id INT)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE work_years DECIMAL(5,2);
    DECLARE grade VARCHAR(20);
    
    SET work_years = fn_calc_work_years(p_emp_id);
    
    IF work_years < 1 THEN
        SET grade = '新员工';
    ELSEIF work_years < 3 THEN
        SET grade = '初级';
    ELSEIF work_years < 5 THEN
        SET grade = '中级';
    ELSEIF work_years < 10 THEN
        SET grade = '高级';
    ELSE
        SET grade = '资深';
    END IF;
    
    RETURN grade;
END //
DELIMITER ;

-- 函数3: 计算部门平均工资
DELIMITER //
DROP FUNCTION IF EXISTS fn_dept_avg_salary;
CREATE FUNCTION fn_dept_avg_salary(p_dept_id INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE avg_sal DECIMAL(10,2);
    
    SELECT AVG(p.base_salary) INTO avg_sal
    FROM employee e
    JOIN position p ON e.pos_id = p.pos_id
    WHERE e.dept_id = p_dept_id AND e.status IN ('在职', '试用期');
    
    RETURN IFNULL(avg_sal, 0);
END //
DELIMITER ;


-- ------------------------------------------------------------
-- 4.3 [触发器扩展] - 更多业务自动化
-- ------------------------------------------------------------

-- 触发器3: 培训成绩录入自动完成标记
DELIMITER //
DROP TRIGGER IF EXISTS trg_training_auto_complete;
CREATE TRIGGER trg_training_auto_complete
BEFORE UPDATE ON emp_training_relation
FOR EACH ROW
BEGIN
    -- 如果成绩>=60分且之前未完成，自动标记为已完成
    IF NEW.score IS NOT NULL AND NEW.score >= 60 AND OLD.is_completed = FALSE THEN
        SET NEW.is_completed = TRUE;
    END IF;
END //
DELIMITER ;

-- 触发器4: 合同状态自动更新（可通过事件调度器触发）
DELIMITER //
DROP TRIGGER IF EXISTS trg_contract_date_check;
CREATE TRIGGER trg_contract_date_check
BEFORE INSERT ON contract
FOR EACH ROW
BEGIN
    -- 插入时检查日期合法性
    IF NEW.end_date IS NOT NULL AND NEW.end_date <= NEW.start_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '合同结束日期必须晚于开始日期';
    END IF;
    
    -- 如果结束日期已过期，自动设为过期状态
    IF NEW.end_date IS NOT NULL AND NEW.end_date < CURDATE() THEN
        SET NEW.status = '过期';
    END IF;
END //
DELIMITER ;

-- 触发器5: 防止删除有关联数据的核心记录（额外安全检查）
DELIMITER //
DROP TRIGGER IF EXISTS trg_dept_delete_check;
CREATE TRIGGER trg_dept_delete_check
BEFORE DELETE ON department
FOR EACH ROW
BEGIN
    DECLARE emp_count INT;
    SELECT COUNT(*) INTO emp_count FROM employee WHERE dept_id = OLD.dept_id;
    
    IF emp_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '该部门还有员工，无法删除';
    END IF;
END //
DELIMITER ;


-- ------------------------------------------------------------
-- 4.4 [存储过程扩展] - 复杂业务处理
-- ------------------------------------------------------------

-- 存储过程2: 员工转正（包含业务判断）
DELIMITER //
DROP PROCEDURE IF EXISTS sp_employee_confirmation;
CREATE PROCEDURE sp_employee_confirmation(
    IN p_emp_id INT,
    OUT p_result VARCHAR(200)
)
BEGIN
    DECLARE emp_status VARCHAR(20);
    DECLARE hire_months INT;
    DECLARE emp_name VARCHAR(50);
    
    -- 获取员工信息
    SELECT status, name, TIMESTAMPDIFF(MONTH, hire_date, CURDATE())
    INTO emp_status, emp_name, hire_months
    FROM employee WHERE emp_id = p_emp_id;
    
    -- 业务规则检查
    IF emp_status IS NULL THEN
        SET p_result = '失败：员工不存在';
    ELSEIF emp_status != '试用期' THEN
        SET p_result = CONCAT('失败：员工', emp_name, '当前状态为', emp_status, '，不是试用期');
    ELSEIF hire_months < 1 THEN
        SET p_result = CONCAT('失败：试用期不满1个月，当前', hire_months, '个月');
    ELSE
        -- 更新员工状态
        UPDATE employee SET status = '在职' WHERE emp_id = p_emp_id;
        -- 触发器会自动记录到 job_change
        SET p_result = CONCAT('成功：员工', emp_name, '已转正，工龄', hire_months, '个月');
    END IF;
END //
DELIMITER ;

-- 存储过程3: 批量考勤录入
DELIMITER //
DROP PROCEDURE IF EXISTS sp_batch_attendance;
CREATE PROCEDURE sp_batch_attendance(
    IN p_dept_id INT,
    IN p_work_date DATE,
    IN p_type VARCHAR(20),
    OUT p_affected_rows INT
)
BEGIN
    -- 批量为某部门的在职员工录入考勤
    INSERT INTO attendance (emp_id, work_date, type, hours)
    SELECT 
        emp_id, 
        p_work_date, 
        p_type,
        CASE 
            WHEN p_type = '正常' THEN 8.0
            WHEN p_type = '请假' THEN 0
            WHEN p_type = '出差' THEN 8.0
            ELSE 8.0
        END AS hours
    FROM employee
    WHERE dept_id = p_dept_id 
      AND status IN ('在职', '试用期')
      AND NOT EXISTS (
          SELECT 1 FROM attendance 
          WHERE emp_id = employee.emp_id 
          AND work_date = p_work_date
      );
    
    SET p_affected_rows = ROW_COUNT();
END //
DELIMITER ;

-- 存储过程4: 部门月度考勤汇总
DELIMITER //
DROP PROCEDURE IF EXISTS sp_dept_attendance_summary;
CREATE PROCEDURE sp_dept_attendance_summary(
    IN p_dept_id INT,
    IN p_month VARCHAR(7)
)
BEGIN
    SELECT 
        e.emp_id,
        e.name,
        d.dept_name,
        COUNT(CASE WHEN a.type = '正常' THEN 1 END) AS normal_days,
        COUNT(CASE WHEN a.type = '迟到' THEN 1 END) AS late_days,
        COUNT(CASE WHEN a.type = '早退' THEN 1 END) AS early_leave_days,
        COUNT(CASE WHEN a.type = '旷工' THEN 1 END) AS absence_days,
        COUNT(CASE WHEN a.type = '请假' THEN 1 END) AS leave_days,
        COUNT(CASE WHEN a.type = '出差' THEN 1 END) AS business_trip_days,
        SUM(a.hours) AS total_hours,
        ROUND(SUM(a.hours) / 22 * 100, 2) AS attendance_rate
    FROM employee e
    JOIN department d ON e.dept_id = d.dept_id
    LEFT JOIN attendance a ON e.emp_id = a.emp_id 
        AND DATE_FORMAT(a.work_date, '%Y-%m') = p_month
    WHERE (p_dept_id IS NULL OR e.dept_id = p_dept_id)
      AND e.status IN ('在职', '试用期')
    GROUP BY e.emp_id, e.name, d.dept_name
    ORDER BY late_days DESC, absence_days DESC;
END //
DELIMITER ;

-- 存储过程5: 员工综合绩效评估
DELIMITER //
DROP PROCEDURE IF EXISTS sp_employee_performance;
CREATE PROCEDURE sp_employee_performance(
    IN p_emp_id INT,
    IN p_month VARCHAR(7)
)
BEGIN
    DECLARE v_base_salary DECIMAL(10,2);
    DECLARE v_reward_total DECIMAL(10,2);
    DECLARE v_late_count INT;
    DECLARE v_absence_count INT;
    DECLARE v_training_complete INT;
    DECLARE v_work_years DECIMAL(5,2);
    DECLARE v_performance_score DECIMAL(5,2);
    
    -- 获取基础数据
    SELECT p.base_salary INTO v_base_salary
    FROM employee e JOIN position p ON e.pos_id = p.pos_id
    WHERE e.emp_id = p_emp_id;
    
    -- 奖惩总额
    SELECT COALESCE(SUM(amount), 0) INTO v_reward_total
    FROM reward_punish
    WHERE emp_id = p_emp_id AND DATE_FORMAT(event_date, '%Y-%m') = p_month;
    
    -- 考勤统计
    SELECT 
        COUNT(CASE WHEN type = '迟到' THEN 1 END),
        COUNT(CASE WHEN type = '旷工' THEN 1 END)
    INTO v_late_count, v_absence_count
    FROM attendance
    WHERE emp_id = p_emp_id AND DATE_FORMAT(work_date, '%Y-%m') = p_month;
    
    -- 培训完成数
    SELECT COUNT(*) INTO v_training_complete
    FROM emp_training_relation
    WHERE emp_id = p_emp_id AND is_completed = TRUE;
    
    -- 工龄
    SET v_work_years = fn_calc_work_years(p_emp_id);
    
    -- 计算综合绩效分（示例算法）
    SET v_performance_score = 100 
        + (v_reward_total / 100)           -- 奖惩影响
        - (v_late_count * 2)               -- 迟到扣分
        - (v_absence_count * 10)           -- 旷工扣分
        + (v_training_complete * 5)        -- 培训加分
        + (v_work_years * 2);              -- 工龄加分
    
    -- 输出结果
    SELECT 
        p_emp_id AS emp_id,
        (SELECT name FROM employee WHERE emp_id = p_emp_id) AS name,
        v_base_salary AS base_salary,
        v_reward_total AS reward_amount,
        v_late_count AS late_count,
        v_absence_count AS absence_count,
        v_training_complete AS training_completed,
        v_work_years AS work_years,
        v_performance_score AS performance_score,
        CASE 
            WHEN v_performance_score >= 90 THEN '优秀'
            WHEN v_performance_score >= 80 THEN '良好'
            WHEN v_performance_score >= 70 THEN '合格'
            ELSE '待改进'
        END AS performance_level;
END //
DELIMITER ;


-- ------------------------------------------------------------
-- 4.5 [事件调度器] - 自动化任务
-- ------------------------------------------------------------

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 事件1: 每天凌晨自动更新过期合同
DELIMITER //
DROP EVENT IF EXISTS evt_update_expired_contracts;
CREATE EVENT evt_update_expired_contracts
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
COMMENT '每天自动检查并更新过期合同状态'
DO
BEGIN
    UPDATE contract 
    SET status = '过期'
    WHERE status = '有效' 
      AND end_date < CURDATE()
      AND end_date IS NOT NULL;
END //
DELIMITER ;

-- 事件2: 每月1号生成上月考勤汇总（可选：需要汇总表）
-- 这里创建一个月度考勤汇总表
CREATE TABLE IF NOT EXISTS attendance_monthly_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    month VARCHAR(7) NOT NULL,
    normal_days INT DEFAULT 0,
    late_days INT DEFAULT 0,
    absence_days INT DEFAULT 0,
    total_hours DECIMAL(6,1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_emp_month (emp_id, month),
    CONSTRAINT fk_summary_emp FOREIGN KEY (emp_id) REFERENCES employee (emp_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='月度考勤汇总表';

DELIMITER //
DROP EVENT IF EXISTS evt_monthly_attendance_summary;
CREATE EVENT evt_monthly_attendance_summary
ON SCHEDULE EVERY 1 MONTH
STARTS CONCAT(DATE_FORMAT(DATE_ADD(LAST_DAY(CURDATE()), INTERVAL 1 DAY), '%Y-%m-%d'), ' 02:00:00')
COMMENT '每月1号生成上月考勤汇总'
DO
BEGIN
    DECLARE last_month VARCHAR(7);
    SET last_month = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m');
    
    -- 插入或更新汇总数据
    INSERT INTO attendance_monthly_summary (emp_id, month, normal_days, late_days, absence_days, total_hours)
    SELECT 
        e.emp_id,
        last_month,
        COUNT(CASE WHEN a.type = '正常' THEN 1 END),
        COUNT(CASE WHEN a.type = '迟到' THEN 1 END),
        COUNT(CASE WHEN a.type = '旷工' THEN 1 END),
        SUM(IFNULL(a.hours, 0))
    FROM employee e
    LEFT JOIN attendance a ON e.emp_id = a.emp_id 
        AND DATE_FORMAT(a.work_date, '%Y-%m') = last_month
    WHERE e.status IN ('在职', '试用期')
    GROUP BY e.emp_id
    ON DUPLICATE KEY UPDATE
        normal_days = VALUES(normal_days),
        late_days = VALUES(late_days),
        absence_days = VALUES(absence_days),
        total_hours = VALUES(total_hours),
        created_at = NOW();
END //
DELIMITER ;


-- ------------------------------------------------------------
-- 4.6 [数据完整性约束增强]
-- ------------------------------------------------------------

-- 添加检查约束（MySQL 8.0.16+）
ALTER TABLE employee
ADD CONSTRAINT chk_id_card_length CHECK (CHAR_LENGTH(id_card) = 18);

ALTER TABLE reward_punish
ADD CONSTRAINT chk_amount_reasonable CHECK (amount BETWEEN -10000 AND 10000);

ALTER TABLE attendance
ADD CONSTRAINT chk_hours_valid CHECK (hours BETWEEN 0 AND 24);

ALTER TABLE emp_training_relation
ADD CONSTRAINT chk_score_range CHECK (score IS NULL OR (score >= 0 AND score <= 100));


-- ------------------------------------------------------------
-- 4.7 [其他高级功能示例]
-- ------------------------------------------------------------

-- 创建工资调整历史表（配合触发器使用）
CREATE TABLE IF NOT EXISTS salary_adjustment_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    pos_id INT NOT NULL,
    pos_name VARCHAR(50),
    old_salary DECIMAL(10, 2),
    new_salary DECIMAL(10, 2),
    adjustment_rate DECIMAL(5,2) COMMENT '调整幅度%',
    adjustment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    operator VARCHAR(50),
    CONSTRAINT fk_sal_log_pos FOREIGN KEY (pos_id) REFERENCES position (pos_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='工资调整历史表';

-- 工资调整审计触发器
DELIMITER //
DROP TRIGGER IF EXISTS trg_log_salary_adjustment;
CREATE TRIGGER trg_log_salary_adjustment
AFTER UPDATE ON position
FOR EACH ROW
BEGIN
    IF OLD.base_salary != NEW.base_salary THEN
        INSERT INTO salary_adjustment_log 
            (pos_id, pos_name, old_salary, new_salary, adjustment_rate)
        VALUES (
            NEW.pos_id, 
            NEW.pos_name,
            OLD.base_salary, 
            NEW.base_salary,
            ROUND((NEW.base_salary - OLD.base_salary) / OLD.base_salary * 100, 2)
        );
    END IF;
END //
DELIMITER ;


-- ============================================================
-- 5. 测试与验证
-- ============================================================

-- 查看所有视图
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';

-- 查看所有存储过程和函数
SHOW PROCEDURE STATUS WHERE Db = 'epms_final_db';
SHOW FUNCTION STATUS WHERE Db = 'epms_final_db';

-- 查看所有触发器
SHOW TRIGGERS;

-- 查看所有事件
SHOW EVENTS;

SET FOREIGN_KEY_CHECKS = 1; -- 恢复外键检查