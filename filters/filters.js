class Filters {

    constructor() {
        this.filters = {
            sex: {
                areaId: 'sex-filters',
                label: 'Sex',
                values: []
            },
            city: {
                areaId: 'city-filters',
                label: 'City',
                values: []
            },
            companyType: {
                areaId: 'company-type-filters',
                label: 'Company type',
                values: []
            },
            seniorityLevel: {
                areaId: 'seniority-level-filters',
                label: 'Seniority level',
                values: []
            }
        };
    }

    updateData(data) {
        this.data = data;
        this.calculateFilterValues();
        this.appendFiltersToPage();
    }

    calculateFilterValues() {
        this.filters.city.values = [...new Set(this.data.map(d => d[DataProperties.CITY]).sort())];
        this.filters.sex.values = [...new Set(this.data.map(d => d[DataProperties.SEX]).sort())];
        this.filters.companyType.values = [...new Set(this.data.map(d => d[DataProperties.COMPANY_TYPE]).sort())];
        this.filters.seniorityLevel.values = [...new Set(this.data.map(d => d[DataProperties.SENIORITY_LEVEL]).sort())];
    }

    appendFiltersToPage() {
        const sexFiltersArea = document.getElementById(this.filters.sex.areaId);
        sexFiltersArea.innerHTML = '<hr><h5 class="text-center">Sex</h5>';
        this.filters.sex.values.forEach((sex, index) => {
            this.appendCheckbox(sexFiltersArea, sex, index)
        });
    }

    appendCheckbox(filterArea, value, index) {
        let input = document.createElement("input");
        input.value = (value + '</br>');
        input.checked = true;
        input.type = "checkbox";
        input.id = "color" + index;
        let text = document.createElement("span");
        text.innerHTML = value + ": ";
        let br = document.createElement("br");
        filterArea.appendChild(text);
        filterArea.appendChild(input);
        filterArea.appendChild(br);
    }
    ;
}