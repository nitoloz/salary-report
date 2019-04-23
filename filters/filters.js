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
        Object.keys(this.filters).forEach(key => {
            const filterArea = document.getElementById(this.filters[key].areaId);
            filterArea.innerHTML = `<hr><h5 class="text-center">${this.filters[key].label}</h5>`;
            this.filters[key].values.forEach((value, index) => {
                this.appendCheckbox(filterArea, value, this.filters[key].areaId, index)
            });
        });
    }

    appendCheckbox(filterArea, value, areaKey, index) {
        let input = document.createElement("input");
        input.value = (value + '</br>');
        input.checked = true;
        input.type = "checkbox";
        input.id = areaKey + index;
        let text = document.createElement("span");
        text.innerHTML = value;
        let br = document.createElement("br");
        filterArea.appendChild(input);
        filterArea.appendChild(text);
        filterArea.appendChild(br);
    }
    ;
}