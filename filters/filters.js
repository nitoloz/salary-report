class Filters {

    constructor() {
        this.filters = {
            sex: new CheckboxFilter('sex-filters', 'Sex', 'SEX', 'sex'),
            city: new CheckboxFilter('city-filters', 'City', 'CITY', 'city'),
            companyType: new CheckboxFilter('company-type-filters', 'Company type', 'COMPANY_TYPE', 'companyType'),
            companySize: new CheckboxFilter('company-size-filters', 'Company size', 'COMPANY_SIZE', 'companySize'),
            seniorityLevel: new CheckboxFilter('seniority-level-filters', 'Seniority level', 'SENIORITY_LEVEL', 'seniorityLevel'),
            language: new CheckboxFilter('language-filters', 'Language', 'WORK_LANGUAGE', 'language'),
            age: new RangeFilter('age-filters', 'Age', 'AGE', 1, 'age'),
            experience: new RangeFilter('experience-filters', 'Experience', 'TOTAL_EXPERIENCE', 1, 'experience'),
            salary: new RangeFilter('salary-filters', 'Salary', 'CURRENT_SALARY', 1000, 'salary'),
            businessSector: new CheckboxFilter('business-sector-filters', 'Business Sector', 'BUSINESS_SECTOR', 'businessSector'),
            vacation: new RangeFilter('vacation-filters', 'Vacation', 'VACATION_DAYS', 1, 'vacation'),
            contractDuration: new CheckboxFilter('contract-duration-filters', 'Contract duration', 'CONTRACT_DURATION', 'contractDuration'),
            position: new CheckboxFilter('position-filters', 'Position', 'POSITION', 'position')
        };
        this.dataLoader = new DataLoader();
        this.dataLoader.getSelectedYear(this.selectedYear);
        this.dataLoader.loadData().then(data => this.updateData(data));
        this.onSelectedYearChange(Utils.getSelectedYear());
        this.listenToYearSelector();
        this.listenToFilterChangeEvent();
    }

    listenToYearSelector() {
        document.querySelector('select[id="yearSelect"]').onchange = (event) => {
            this.onSelectedYearChange(event.target.value);
            localStorage.setItem('selectedYear', event.target.value);
            this.dataLoader.getSelectedYear();
            this.dataLoader.loadData().then(data => this.updateData(data));
            this.showSelectedFiltersWidget([]);
        };
    }

    listenToFilterChangeEvent() {
        document.addEventListener('update', (e) => {
            this.applyFilters();
        }, false);
    }

    onSelectedYearChange(year) {
        switch (year) {
            case '2019':
                this.toggleDisabledSelectOptions(false);
                this.toggleVisibleFilters(true);
                break;
            case '2018':
            case '2017':
                this.toggleDisabledSelectOptions(true);
                this.toggleVisibleFilters(false);
                break;
            default:
                break;
        }
    }

    toggleDisabledSelectOptions(disabled) {
        ['boxPlotYAxisSelect', 'boxPlotXAxisSelect', 'pieChartSelect'].forEach(selectId => {
            const select = document.getElementById(selectId);
            const options = select.getElementsByClassName("last-year-option");
            for (let i = 0; i < options.length; i++) {
                options[i].disabled = disabled;
                if (options[i].selected) {
                    const firstSelectOption = select.getElementsByTagName('option')[0];
                    firstSelectOption.selected = true;
                    select.onchange({target: {value: firstSelectOption.value}});
                }
            }
        });
    }

    toggleVisibleFilters(visible) {
        const filters = document.getElementById('mySidepanel').getElementsByClassName("last-year-filter");
        for (let i = 0; i < filters.length; i++) {
            filters[i].style.display = visible ? 'block' : 'none';
        }
    }

    updateData(data) {
        this.data = data;
        Object.keys(this.filters).forEach(key => {
            const values = this.data.map(d => d[DataProperties[this.filters[key].dataKey]]).filter(value => !!value);
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
                let filterText = document.createElement("span");
                filterText.className = 'filter-widget';
                filterText.innerHTML = filter.widgetText;
                //TODO add "Clear filter" button
                // let removeFilterButton = document.createElement("i");
                // removeFilterButton.className = 'fas fa-times remove-filter';
                // removeFilterButton.onclick = function (event) {
                //     console.log('remove clicked' + filter);
                // };
                //
                // filterText.appendChild(removeFilterButton);

                document.getElementById("filter-content").appendChild(filterText);
            });
            document.getElementById("filter-widget").className = document.getElementById("filter-widget").className.replace(/\binvisible\b/g, "visible");
        } else {
            document.getElementById("filter-widget").className = document.getElementById("filter-widget").className.replace(/\bvisible\b/g, "invisible");
        }
    }

    applyFilters() {
        const appliedFilters = this.getAppliedFilters();
        this.dataLoader.filterData(appliedFilters);
        this.showSelectedFiltersWidget(appliedFilters);
    }
}

const filters = new Filters();
