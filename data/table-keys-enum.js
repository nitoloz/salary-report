const COLUMN_NAMES_2018 = {
    TIMESTAMP: 'Timestamp',
    AGE: 'Age',
    SEX: 'Gender',
    POSITION: 'Position',
    // EUROPE_EXPERIENCE: 'Опыт работы в Европе',
    TOTAL_EXPERIENCE: 'Years of experience',
    CITY: 'City',
    CURRENT_SALARY: 'Current Salary',
    PREVIOUS_SALARY: 'Salary one year ago',
    FIRST_EUROPE_SALARY: 'Salary two years ago',
    WORK_LANGUAGE: 'Main language at work',
    COMPANY_SIZE: 'Company size',
    COMPANY_TYPE: 'Company type',
    SENIORITY_LEVEL: 'Your level',
    SALARY_RAISE: 'Salary raise'
};

const COLUMN_NAMES_2017 = {
    TIMESTAMP: 'Отметка времени',
    AGE: 'Возраст',
    SEX: 'Пол',
    POSITION: 'Position',
    EUROPE_EXPERIENCE: 'Опыт работы в Европе',
    TOTAL_EXPERIENCE: 'Опыт работы в целом',
    CITY: 'Город',
    CURRENT_SALARY: 'Текущая ЗП',
    PREVIOUS_SALARY: 'ЗП год назад',
    FIRST_EUROPE_SALARY: 'Какая была первая ЗП в Европе',
    // EUROPE_JOB_COUNT: 'Какая по счету у вас сейчас работа в Европе',
    WORK_LANGUAGE: 'Основной язык на работе',
    COMPANY_SIZE: 'Размер компании',
    COMPANY_TYPE: 'Тип компании',
    SENIORITY_LEVEL: 'Уровень',
    SALARY_RAISE: 'Salary raise'
};

class DataProperties {

    static get TIMESTAMP() { return this._TIMESTAMP; }
    static set TIMESTAMP(v) { this._TIMESTAMP = v; }

    static get AGE() { return this._AGE; }
    static set AGE(v) { this._AGE = v; }

    static get SEX() { return this._SEX; }
    static set SEX(v) { this._SEX = v; }

    static get POSITION() { return this._POSITION; }
    static set POSITION(v) { this._POSITION = v; }

    static get TOTAL_EXPERIENCE() { return this._TOTAL_EXPERIENCE; }
    static set TOTAL_EXPERIENCE(v) { this._TOTAL_EXPERIENCE = v; }

    static get CITY() { return this._CITY; }
    static set CITY(v) { this._CITY = v; }

    static get CURRENT_SALARY() { return this._CURRENT_SALARY; }
    static set CURRENT_SALARY(v) { this._CURRENT_SALARY = v; }

    static get PREVIOUS_SALARY() { return this._PREVIOUS_SALARY; }
    static set PREVIOUS_SALARY(v) { this._PREVIOUS_SALARY = v; }

    static get FIRST_EUROPE_SALARY() { return this._FIRST_EUROPE_SALARY; }
    static set FIRST_EUROPE_SALARY(v) { this._FIRST_EUROPE_SALARY = v; }

    static get WORK_LANGUAGE() { return this._WORK_LANGUAGE; }
    static set WORK_LANGUAGE(v) { this._WORK_LANGUAGE = v; }

    static get COMPANY_SIZE() { return this._COMPANY_SIZE; }
    static set COMPANY_SIZE(v) { this._COMPANY_SIZE = v; }

    static get COMPANY_TYPE() { return this._COMPANY_TYPE; }
    static set COMPANY_TYPE(v) { this._COMPANY_TYPE = v; }

    static get SENIORITY_LEVEL() { return this._SENIORITY_LEVEL; }
    static set SENIORITY_LEVEL(v) { this._SENIORITY_LEVEL = v; }

    static get SALARY_RAISE() { return this._SALARY_RAISE; }
    static set SALARY_RAISE(v) { this._SALARY_RAISE = v; }
}

updateColumnNames(COLUMN_NAMES_2018);

function updateColumnNames(CURRENT_COLUMN_NAMES) {
    DataProperties.TIMESTAMP = CURRENT_COLUMN_NAMES.TIMESTAMP;
    DataProperties.AGE = CURRENT_COLUMN_NAMES.AGE;
    DataProperties.SEX = CURRENT_COLUMN_NAMES.SEX;
    DataProperties.POSITION = CURRENT_COLUMN_NAMES.POSITION;
    DataProperties.TOTAL_EXPERIENCE = CURRENT_COLUMN_NAMES.TOTAL_EXPERIENCE;
    DataProperties.CITY = CURRENT_COLUMN_NAMES.CITY;
    DataProperties.CURRENT_SALARY = CURRENT_COLUMN_NAMES.CURRENT_SALARY;
    DataProperties.PREVIOUS_SALARY = CURRENT_COLUMN_NAMES.PREVIOUS_SALARY;
    DataProperties.FIRST_EUROPE_SALARY = CURRENT_COLUMN_NAMES.FIRST_EUROPE_SALARY;
    DataProperties.WORK_LANGUAGE = CURRENT_COLUMN_NAMES.WORK_LANGUAGE;
    DataProperties.COMPANY_SIZE = CURRENT_COLUMN_NAMES.COMPANY_SIZE;
    DataProperties.COMPANY_TYPE = CURRENT_COLUMN_NAMES.COMPANY_TYPE;
    DataProperties.SENIORITY_LEVEL = CURRENT_COLUMN_NAMES.SENIORITY_LEVEL;
    DataProperties.SALARY_RAISE = CURRENT_COLUMN_NAMES.SALARY_RAISE;
}


