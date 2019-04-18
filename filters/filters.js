class Filters {

    constructor() {
    }

    updateData(data) {
        this.data = data;
        this.filters = [];
        this.calculateFilterValues();
        this.appendFiltersToPage();
    }

    calculateFilterValues() {
        this.cities = [...new Set(this.data.map(d => d[DataProperties.CITY]).sort())];
        this.genders = [...new Set(this.data.map(d => d[DataProperties.SEX]).sort())];
        this.companyTypes = [...new Set(this.data.map(d => d[DataProperties.COMPANY_TYPE]).sort())];
        this.seniorityLevels = [...new Set(this.data.map(d => d[DataProperties.SENIORITY_LEVEL]).sort())];
    }

    appendFiltersToPage() {
        const sexFiltersArea = document.getElementById('sex-filters');
        sexFiltersArea.innerHTML = '';
        this.genders.forEach((sex, index) => {
            this.appendCheckbox(sexFiltersArea, sex, index)
        });
    }

    appendCheckbox(filterArea, value, index) {
        let input = document.createElement("input");
        input.value = (value + '</br>');
        input.checked  = true;
        input.type = "checkbox";
        input.id = "color" + index;
        let text = document.createElement("span");
        text.innerHTML = value + ": ";
        let br = document.createElement("br");
        filterArea.appendChild(text);
        filterArea.appendChild(input);
        filterArea.appendChild(br);
    };
}