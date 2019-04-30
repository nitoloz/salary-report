class Filters {

    constructor() {
        this.filters = {
            sex: {
                areaId: 'sex-filters',
                label: 'Sex',
                dataKey: 'SEX',
                values: [],
                selectedValues: [],
                type: FILTER_TYPES.CHECKBOX
            },
            city: {
                areaId: 'city-filters',
                label: 'City',
                dataKey: 'CITY',
                values: [],
                selectedValues: [],
                type: FILTER_TYPES.CHECKBOX
            },
            companyType: {
                areaId: 'company-type-filters',
                label: 'Company type',
                dataKey: 'COMPANY_TYPE',
                values: [],
                selectedValues: [],
                type: FILTER_TYPES.CHECKBOX
            },
            companySize: {
                areaId: 'company-size-filters',
                label: 'Company size',
                dataKey: 'COMPANY_SIZE',
                values: [],
                selectedValues: [],
                type: FILTER_TYPES.CHECKBOX
            },
            seniorityLevel: {
                areaId: 'seniority-level-filters',
                label: 'Seniority level',
                dataKey: 'SENIORITY_LEVEL',
                values: [],
                selectedValues: [],
                type: FILTER_TYPES.CHECKBOX
            },
            language: {
                areaId: 'language-filters',
                label: 'Language',
                dataKey: 'WORK_LANGUAGE',
                values: [],
                selectedValues: [],
                type: FILTER_TYPES.CHECKBOX
            }
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
                    const filterArea = document.getElementById(this.filters[key].areaId);
                    filterArea.innerHTML = `<hr><h5 class="text-center">${this.filters[key].label}</h5>`;

                    const that = this;
                    let selectAllButton = document.createElement("button");
                    selectAllButton.innerHTML = "Select all";
                    selectAllButton.id = key + '_select_all';
                    selectAllButton.className = 'btn btn-outline-secondary btn-sm';
                    selectAllButton.onclick = function (event) {
                        that.filters[key].selectedValues = that.filters[key].values.map(value => value.value).slice();
                        const checkBoxes = filterArea.getElementsByTagName('input');
                        for (let checkBox of checkBoxes) {
                            checkBox.checked = true
                        }
                        that.dataLoader.filterData(that.getAppliedFilters());
                    };

                    let deselectAllButton = document.createElement("button");
                    deselectAllButton.innerHTML = "Deselect all";
                    deselectAllButton.id = key + '_deselect_all';
                    deselectAllButton.className = 'btn btn-outline-secondary btn-sm';
                    deselectAllButton.onclick = function (event) {
                        that.filters[key].selectedValues = [];
                        const checkBoxes = filterArea.getElementsByTagName('input');
                        for (let checkBox of checkBoxes) {
                            checkBox.checked = false
                        }
                        that.dataLoader.filterData(that.getAppliedFilters());
                    };

                    let buttonGroup = document.createElement("div");
                    buttonGroup.role = 'group';
                    buttonGroup.className = 'btn-group btn-group-justified';
                    buttonGroup.appendChild(selectAllButton);
                    buttonGroup.appendChild(deselectAllButton);
                    filterArea.appendChild(buttonGroup);
                    this.filters[key].values.forEach((value, index) => {
                        this.appendCheckbox(filterArea, value, key, index)
                    });
                    break;
                default:
                    break;
            }
        });
    }

    appendCheckbox(filterArea, value, filterKey, index) {
        let input = document.createElement("input");
        input.value = (value + '</br>');
        input.checked = true;
        input.type = "checkbox";
        input.id = filterKey + index;
        const that = this;
        input.addEventListener('change', function () {
            if (this.checked) {
                that.filters[filterKey].selectedValues.push(value.value);
            } else {
                let selectedItemIndex = that.filters[filterKey].selectedValues.indexOf(value.value);
                if (selectedItemIndex !== -1) {
                    that.filters[filterKey].selectedValues.splice(selectedItemIndex, 1);
                }
            }
            that.dataLoader.filterData(that.getAppliedFilters());
        });

        let text = document.createElement("span");
        text.innerHTML = `${value.value} (${value.count})`;
        let br = document.createElement("br");

        filterArea.appendChild(input);
        filterArea.appendChild(text);
        filterArea.appendChild(br);
    }

    getAppliedFilters() {
        const appliedFilters = [];
        Object.keys(this.filters).forEach(key => {
            switch (this.filters[key].type) {
                case FILTER_TYPES.CHECKBOX:
                    if (this.filters[key].values.length !== this.filters[key].selectedValues.length) {
                        appliedFilters.push({
                            type: FILTER_TYPES.CHECKBOX,
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
        let valuesWithCounts = Object.keys(internalMap).map((key) => {
            return {value: key, count: internalMap[key]};
        }).sort((a, b) => b.count - a.count);

        return valuesWithCounts;
    }
}

const filters = new Filters();
