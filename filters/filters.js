class Filters {

    constructor() {
        this.filters = {
            sex: new CheckboxFilter('sex-filters', 'Sex', 'SEX'),
            city: new CheckboxFilter('city-filters', 'City', 'CITY'),
            companyType: new CheckboxFilter('company-type-filters', 'Company type', 'COMPANY_TYPE'),
            companySize: new CheckboxFilter('company-size-filters', 'Company size', 'COMPANY_SIZE'),
            seniorityLevel: new CheckboxFilter('seniority-level-filters', 'Seniority level', 'SENIORITY_LEVEL'),
            language: new CheckboxFilter('language-filters', 'Language', 'WORK_LANGUAGE')
        };
        this.dataLoader = new DataLoader();
        this.dataLoader.getSelectedYear();
        this.dataLoader.loadData().then(data => this.updateData(data));
        this.listenToYearSelector();
        this.listenToFilterChangeEvent();
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

    listenToFilterChangeEvent(){
        document.addEventListener('update', (e) => {
            this.applyFilters();
        }, false);
    }

    updateData(data) {
        this.data = data;
        Object.keys(this.filters).forEach(key => {
            const values = this.data.map(d => d[this.filters[key].dataKey]).filter(value => !!value);
            this.filters[key].initializeFilterValues(values);
        });
        Object.keys(this.filters).forEach(key => this.filters[key].appendFilter());
    }

    getAppliedFilters() {
        return Object.keys(this.filters)
            .filter(key => this.filters[key].isFilterSelected())
            .map(key => this.filters[key].getAppliedValues());
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
