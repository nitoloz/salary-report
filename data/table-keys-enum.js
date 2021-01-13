const COLUMN_NAMES_2020 = {
    TIMESTAMP: 'Timestamp',
    AGE: 'Age',
    SEX: 'Gender',
    POSITION: 'Position ',
    TOTAL_EXPERIENCE: 'Total years of experience',
    CITY: 'City',
    CURRENT_SALARY: 'Yearly brutto salary (without bonus and stocks) in EUR',
    PREVIOUS_SALARY: 'Annual brutto salary (without bonus and stocks) one year ago. Only answer if staying in the same country',
    FIRST_EUROPE_SALARY: '',
    WORK_LANGUAGE: 'Main language at work',
    COMPANY_SIZE: 'Company size',
    COMPANY_TYPE: 'Company type',
    SENIORITY_LEVEL: 'Seniority level',
    SALARY_RAISE: 'Salary raise',

    MAIN_TECHNOLOGY: 'Your main technology / programming language',
    CURRENT_BONUS: 'Yearly bonus + stocks in EUR',
    CURRENT_STOCKS: '',
    PREVIOUS_BONUS: 'Annual bonus+stocks one year ago. Only answer if staying in same country',
    PREVIOUS_STOCKS: '',
    VACATION_DAYS: 'Number of vacation days',
    HOMEOFFICE_DAYS: '',
    COMPANY_NAME: 'Company name',
    CONTRACT_DURATION: 'Сontract duration',
    BUSINESS_SECTOR: ''
};

const COLUMN_NAMES_2019 = {
    TIMESTAMP: 'Timestamp',
    AGE: 'Age',
    SEX: 'Gender',
    POSITION: 'Position (without seniority)',
    TOTAL_EXPERIENCE: 'Years of experience',
    CITY: 'City',
    CURRENT_SALARY: 'Yearly brutto salary (without bonus and stocks)',
    PREVIOUS_SALARY: 'Yearly brutto salary (without bonus and stocks) one year ago. Only answer if staying in same country',
    FIRST_EUROPE_SALARY: '',
    WORK_LANGUAGE: 'Main language at work',
    COMPANY_SIZE: 'Company size',
    COMPANY_TYPE: 'Company type',
    SENIORITY_LEVEL: 'Seniority level',
    SALARY_RAISE: 'Salary raise',

    MAIN_TECHNOLOGY: 'Your main technology / programming language',
    CURRENT_BONUS: 'Yearly bonus',
    CURRENT_STOCKS: 'Yearly stocks',
    PREVIOUS_BONUS: 'Yearly bonus one year ago. Only answer if staying in same country',
    PREVIOUS_STOCKS: 'Yearly stocks one year ago. Only answer if staying in same country',
    VACATION_DAYS: 'Number of vacation days',
    HOMEOFFICE_DAYS: 'Number of home office days per month',
    COMPANY_NAME: 'Company name',
    CONTRACT_DURATION: 'Сontract duration',
    BUSINESS_SECTOR: 'Company business sector'
};

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

    static get TIMESTAMP() {
        return this._TIMESTAMP;
    }

    static set TIMESTAMP(v) {
        this._TIMESTAMP = v;
    }

    static get AGE() {
        return this._AGE;
    }

    static set AGE(v) {
        this._AGE = v;
    }

    static get SEX() {
        return this._SEX;
    }

    static set SEX(v) {
        this._SEX = v;
    }

    static get POSITION() {
        return this._POSITION;
    }

    static set POSITION(v) {
        this._POSITION = v;
    }

    static get TOTAL_EXPERIENCE() {
        return this._TOTAL_EXPERIENCE;
    }

    static set TOTAL_EXPERIENCE(v) {
        this._TOTAL_EXPERIENCE = v;
    }

    static get CITY() {
        return this._CITY;
    }

    static set CITY(v) {
        this._CITY = v;
    }

    static get CURRENT_SALARY() {
        return this._CURRENT_SALARY;
    }

    static set CURRENT_SALARY(v) {
        this._CURRENT_SALARY = v;
    }

    static get PREVIOUS_SALARY() {
        return this._PREVIOUS_SALARY;
    }

    static set PREVIOUS_SALARY(v) {
        this._PREVIOUS_SALARY = v;
    }

    static get FIRST_EUROPE_SALARY() {
        return this._FIRST_EUROPE_SALARY;
    }

    static set FIRST_EUROPE_SALARY(v) {
        this._FIRST_EUROPE_SALARY = v;
    }

    static get WORK_LANGUAGE() {
        return this._WORK_LANGUAGE;
    }

    static set WORK_LANGUAGE(v) {
        this._WORK_LANGUAGE = v;
    }

    static get COMPANY_SIZE() {
        return this._COMPANY_SIZE;
    }

    static set COMPANY_SIZE(v) {
        this._COMPANY_SIZE = v;
    }

    static get COMPANY_TYPE() {
        return this._COMPANY_TYPE;
    }

    static set COMPANY_TYPE(v) {
        this._COMPANY_TYPE = v;
    }

    static get SENIORITY_LEVEL() {
        return this._SENIORITY_LEVEL;
    }

    static set SENIORITY_LEVEL(v) {
        this._SENIORITY_LEVEL = v;
    }

    static get SALARY_RAISE() {
        return this._SALARY_RAISE;
    }

    static set SALARY_RAISE(v) {
        this._SALARY_RAISE = v;
    }

    static get MAIN_TECHNOLOGY() {
        return this._MAIN_TECHNOLOGY;
    }

    static set MAIN_TECHNOLOGY(v) {
        this._MAIN_TECHNOLOGY = v;
    }

    static get CURRENT_BONUS() {
        return this._CURRENT_BONUS;
    }

    static set CURRENT_BONUS(v) {
        this._CURRENT_BONUS = v;
    }

    static get CURRENT_STOCKS() {
        return this._CURRENT_STOCKS;
    }

    static set CURRENT_STOCKS(v) {
        this._CURRENT_STOCKS = v;
    }

    static get PREVIOUS_BONUS() {
        return this._PREVIOUS_BONUS;
    }

    static set PREVIOUS_BONUS(v) {
        this._PREVIOUS_BONUS = v;
    }

    static get PREVIOUS_STOCKS() {
        return this._PREVIOUS_STOCKS;
    }

    static set PREVIOUS_STOCKS(v) {
        this._PREVIOUS_STOCKS = v;
    }

    static get VACATION_DAYS() {
        return this._VACATION_DAYS;
    }

    static set VACATION_DAYS(v) {
        this._VACATION_DAYS = v;
    }

    static get HOMEOFFICE_DAYS() {
        return this._HOMEOFFICE_DAYS;
    }

    static set HOMEOFFICE_DAYS(v) {
        this._HOMEOFFICE_DAYS = v;
    }

    static get COMPANY_NAME() {
        return this._COMPANY_NAME;
    }

    static set COMPANY_NAME(v) {
        this._COMPANY_NAME = v;
    }

    static get CONTRACT_DURATION() {
        return this._CONTRACT_DURATION;
    }

    static set CONTRACT_DURATION(v) {
        this._CONTRACT_DURATION = v;
    }

    static get BUSINESS_SECTOR() {
        return this._BUSINESS_SECTOR;
    }

    static set BUSINESS_SECTOR(v) {
        this._BUSINESS_SECTOR = v;
    }
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

    DataProperties.MAIN_TECHNOLOGY = CURRENT_COLUMN_NAMES.MAIN_TECHNOLOGY;
    DataProperties.CURRENT_BONUS = CURRENT_COLUMN_NAMES.CURRENT_BONUS;
    DataProperties.CURRENT_STOCKS = CURRENT_COLUMN_NAMES.CURRENT_STOCKS;
    DataProperties.PREVIOUS_BONUS = CURRENT_COLUMN_NAMES.PREVIOUS_BONUS;
    DataProperties.PREVIOUS_STOCKS = CURRENT_COLUMN_NAMES.PREVIOUS_STOCKS;
    DataProperties.VACATION_DAYS = CURRENT_COLUMN_NAMES.VACATION_DAYS;
    DataProperties.HOMEOFFICE_DAYS = CURRENT_COLUMN_NAMES.HOMEOFFICE_DAYS;
    DataProperties.COMPANY_NAME = CURRENT_COLUMN_NAMES.COMPANY_NAME;
    DataProperties.CONTRACT_DURATION = CURRENT_COLUMN_NAMES.CONTRACT_DURATION;
    DataProperties.BUSINESS_SECTOR = CURRENT_COLUMN_NAMES.BUSINESS_SECTOR;
}


