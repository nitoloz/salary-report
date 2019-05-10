class Filters {

    constructor() {
        this.filters = {
            sex: new CheckboxFilter('sex-filters','Sex','SEX'),
            city: new CheckboxFilter('city-filters','City','CITY'),
            companyType:new CheckboxFilter('company-type-filters','Company type','COMPANY_TYPE'),
            companySize: new CheckboxFilter('company-size-filters','Company size','COMPANY_SIZE'),
            seniorityLevel: new CheckboxFilter('seniority-level-filters','Seniority level','SENIORITY_LEVEL'),
            language: new CheckboxFilter('language-filters','Language','WORK_LANGUAGE')
        };
        this.dataLoader = new DataLoader();
        this.dataLoader.getSelectedYear();
        this.dataLoader.loadData().then(data => this.updateData(data));
        this.listenToYearSelector();
    }

    listenToYearSelector() {
        document.querySelector('select[id="yearSelect"]').onchange = (event) => {
            switch (event.target.value) {
                case '2018':
                case '2017':
                    localStorage.setItem('selectedYear', event.target.value);
                    this.dataLoader.getSelectedYear();
                    this.dataLoader.loadData().then(data => this.updateData(data));
                    break;
                default:
                    break;
            }
        };
    }

    updateData(data) {
        this.data = data;
        this.calculateFilterValues();
        this.appendFiltersToPage();
    }

    calculateFilterValues() {
        Object.keys(this.filters).forEach(key => {
            this.filters[key].values = this.getAvailableFilterValues(DataProperties[this.filters[key].dataKey]);
            this.filters[key].selectedValues = this.filters[key].values.map(value => value.value).slice();
        });
    }

    appendFiltersToPage() {
        Object.keys(this.filters).forEach(key => {
            switch (this.filters[key].type) {
                case FILTER_TYPES.CHECKBOX:
                    this.filters[key].appendFilter();
                    break;
                default:
                    break;
            }
        });
    }

    getAppliedFilters() {
        const appliedFilters = [];
        Object.keys(this.filters).forEach(key => {
            switch (this.filters[key].type) {
                case FILTER_TYPES.CHECKBOX:
                    if (this.filters[key].values.length !== this.filters[key].selectedValues.length) {
                        appliedFilters.push({
                            type: FILTER_TYPES.CHECKBOX,
                            label: this.filters[key].label,
                            dataKey: this.filters[key].dataKey,
                            values: this.filters[key].selectedValues
                        });
                    }
                    break;
                default:
                    break;
            }
        });
        return appliedFilters;
    }

    getAvailableFilterValues(filterProperty) {
        const values = this.data.map(d => d[filterProperty]).filter(value => !!value);
        const internalMap = new Map();
        values.forEach(d => internalMap[d] ? internalMap[d]++ : internalMap[d] = 1);
        return Object.keys(internalMap).map((key) => {
            return {value: key, count: internalMap[key]};
        }).sort((a, b) => b.count - a.count);
    }


    showSelectedFiltersWidget(appliedFilters) {
        document.getElementById("filter-content").innerHTML = ``;
        if (appliedFilters.length > 0) {
            appliedFilters.forEach(filter => {
                //TODO grey values
                let filterText = document.createElement("span");
                filterText.className = 'filter-widget';
                filterText.innerHTML = `${filter.label} (${filter.values.length > 4 ? filter.values.length + ' selected' : filter.values.join(',')})`;
                document.getElementById("filter-content").appendChild(filterText);
            });
            document.getElementById("filter").className = document.getElementById("filter").className.replace(/\binvisible\b/g, "visible");
        } else {
            document.getElementById("filter").className = document.getElementById("filter").className.replace(/\bvisible\b/g, "invisible");
        }
    }

    applyFilters() {
        const appliedFilters = this.getAppliedFilters();
        this.dataLoader.filterData(appliedFilters);
        this.showSelectedFiltersWidget(appliedFilters);
    }
}

const filters = new Filters();
