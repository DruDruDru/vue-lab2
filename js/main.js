let eventBus50 = new Vue()
let eventBus100 = new Vue()

Vue.component('column', {   
    props: {
        tasks: {
            type: Array,
            required: true,
        },
        canAdd: {
            type: Boolean,
            required: true,
        },
        addTask: {
            type: Array,
            required: false,
        },
    },
    template: `
        <div class="column">
            <div id="divBlock" v-if="isFirst" style="display: none"></div>
            <card 
                v-for="task in tasks" 
                :key="task.id"
                :task="task"
                :first-column="addTask"
                @add-point-submitted="addToTask"
                @on-check="moveToSecond"
            ></card>
            <add-card 
                v-if="canAdd" 
                @add-card-submitted="addToColumn"
                :isDisplayForm="isDisplayForForm"
            ></add-card>
        </div>
    `,
    data() {
        return {
            ID: 4,
        }
    },
    methods: {
        addToColumn(task) {
            if (this.addTask.length < 3) {
                let temp = {
                    id: ++this.ID,
                    title: task.title,
                    list: [
                        { name: task.firstPoint, checked: false },
                        { name: task.secondPoint, checked: false },
                        { name: task.thirdPoint, checked: false }
                    ],
                    date: null,
                    percents: 0,
                }
                this.addTask.push(temp)

                localStorage.setItem('ID', JSON.stringify(this.ID))
                const ID = localStorage.getItem('ID');
                if (ID) this.ID = JSON.parse(ID);
            }

        },
        addToTask(obj) {
            let iter = 0;
            for (task of this.addTask) {
                if (obj.id === task.id) {
                    if (this.addTask[iter].list.length < 5 ) {
                        this.addTask[iter].list.push(
                            { name: obj.point, checked: false }
                        )
                    }
                }
                iter++;
            }
        },
        moveToSecond(task) {
            eventBus50.$emit('on-check', task)
        },
        moveToThird(task) {
            eventBus100.$emit('on-check', task)
        }
    },
    mounted() {
        localStorage.setItem('ID', JSON.stringify(this.ID))
        const ID = localStorage.getItem('ID');
        if (ID) this.ID = JSON.parse(ID);
    },
    computed: {
        isFirst() {
            return this.addTask;
        },
        isDisplayForForm() {
            return this.addTask.length < 3
        },
    },
})

Vue.component('card', {
    props: {
        task: {
            type: Object,
            required: true
        },
        firstColumn: {
            type: Array,
            required: false,
        }
    },
    data() {
        return {
            click: false,
            point: null,
        }
    },
    template: `
        </div>
        <div class="card">
            <div class="titleContainer">
                <h2>{{ task.title }}</h2>
                <button 
                    type="button"
                    @click="isClick" 
                    :disabled="isDisabled"
                    v-show="isFirstColumn"
                >+</button>
            </div>
            
            <div v-for="point in task.list">
                <input 
                    type="checkbox" 
                    :id="point.name" 
                    :name="point.name" 
                    class="checkboxInput"
                    v-model="point.checked"
                    @change="onCheckbox(point)"
                />
                <label :for="point.name">{{ point.name }}</label>
            </div> 
            <div class="date-block">
                {{ this.task.date }}
            </div>
            <div>
                {{ this.task.percents + "%" }}
            </div>
            <form @submit.prevent="onAddPoint(task.id)" v-show="click" >
                <input type="text" required v-model="point" />
                <input type="submit" value="Добавить" />
            </form>
        </div>
    `,
    methods: {
        isClick() {
            if (this.click === true) this.click = false;
            this.click = true;
        },
        onAddPoint(cardId) {
            this.click = true
            if (this.point) {
                this.$emit('add-point-submitted', {id: cardId, point: this.point});
                this.point = null;
                this.click = false
            }
        },
        onCheckbox(point) {
            count = 0;
            for (point of this.task.list) {
                if (point.checked) count++;
            }
            let percents = 100 / this.task.list.length * count
            this.task.percents = Math.round(percents)
            if (percents >= 50 && percents < 100) eventBus50.$emit('on-check', this.task)
            if (percents === 100) eventBus100.$emit('on-check', this.task)
        }
    },
    computed: {
        isDisabled() {
            return this.task.list.length >= 5;
        },
        isFirstColumn() {
            return this.firstColumn;
        },

    },
})

Vue.component('add-card', {
    props: {
        isDisplayForm: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <form @submit.prevent="onSubmit" class="createTask" v-show="isDisplayForm">
            <input type="text" maxlength=45 required v-model="title" class="inputFortitle" />
            <div class="poinsContainer">
                <div>
                    <span>1.</span>
                    <input type="text" required v-model="firstPoint" />
                </div>
                <div>
                    <span>2.</span>
                    <input type="text" required v-model="secondPoint" />
                </div>
                <div>
                    <span>3.</span>
                    <input type="text" required v-model="thirdPoint" />
                </div>
            </div>
            <input type="submit" value="Добавить" />
        </form>
    `,
    data() {
        return {
            title: null,
            firstPoint: null,
            secondPoint: null,
            thirdPoint: null,
            clicked: null,
        }
    },
    methods: {
        onSubmit() {
            if (this.title && this.firstPoint && this.secondPoint && this.thirdPoint) {
                let task = {
                    title: this.title,
                    firstPoint: this.firstPoint,
                    secondPoint: this.secondPoint,
                    thirdPoint: this.thirdPoint,
                }
                this.$emit('add-card-submitted', task)
                this.title = null
                this.firstPoint = null
                this.secondPoint = null
                this.thirdPoint = null
            }
        },
    },
})

let app = new Vue({
    el: '#app',

    data: {
        addInFirstColumn: true,
        addInSecondColumn: false,
        addInThirdColumn: false,
        blockedDiv: null,
        tasksOfFirst: [
            {
                id: 0,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: false },
                    { name: 'Биология', checked : false }
                ],
                date: null,
                percents: 0,
            },
            {
                id: 1,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: false },
                    { name: 'Биология', checked : false }
                ],
                date: null,
                percents: 0,
            }
        ],
        tasksOfSecond: [
            {
                id: 2,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: true },
                    { name: 'Биология', checked : true }
                ],
                date: null,
                percents: 67,
            },
            {
                id: 3,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: true },
                    { name: 'Биология', checked : true }
                ],
                date: null,
                percents: 67,
            }
        ],
        tasksOfThird: [
            {
                id: 4,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: true },
                    { name: 'Алгебра', checked: true },
                    { name: 'Биология', checked : true }
                ],
                date: new Date().toDateString() + ' --- ' + new Date().toTimeString(),
                percents: 100,
            }
        ],
    },
    methods: {
        handleOnCheck50(task) {

            if (this.tasksOfFirst.includes(task) && !(this.tasksOfSecond.includes(task)) && (this.tasksOfSecond.length < 5)) {
                const idx = this.tasksOfFirst.indexOf(task)
                this.tasksOfFirst = this.tasksOfFirst.filter((value, index) => idx !== index)
                this.tasksOfSecond.push(task)
            } else if ((this.tasksOfSecond.length === 5) && (this.tasksOfFirst.includes(task))) {
                document.getElementById('divBlock').style.display = 'block';
            }

            checksInSecond = document.getElementById('secondColumn').querySelectorAll('input[type="checkbox"]');
            checksInThird = document.getElementById('thirdColumn').querySelectorAll('input[type="checkbox"]');

            localStorage.setItem('tasksOfFirst', JSON.stringify(this.tasksOfFirst))
            localStorage.setItem('tasksOfSecond', JSON.stringify(this.tasksOfSecond))
            localStorage.setItem('tasksOfThird', JSON.stringify(this.tasksOfThird))
            const tasksOfFirst = localStorage.getItem('tasksOfFirst');
            const tasksOfSecond = localStorage.getItem('tasksOfSecond');
            const tasksOfThird = localStorage.getItem('tasksOfThird');

            if (tasksOfFirst) this.tasksOfFirst = JSON.parse(tasksOfFirst);
            if (tasksOfSecond) this.tasksOfSecond = JSON.parse(tasksOfSecond);
            if (tasksOfThird) this.tasksOfThird = JSON.parse(tasksOfThird);

        },
        handleOnCheck100(task) {

            if (this.tasksOfSecond.includes(task)) {
                let flag = false;
                if (this.tasksOfSecond.length === 5) {
                    document.getElementById('divBlock').style.display = 'none';
                    flag = true;
                }
                const idx = this.tasksOfSecond.indexOf(task)
                this.tasksOfSecond = this.tasksOfSecond.filter((value, index) => idx !== index)
                task.date = new Date().toDateString() + ' --- ' + new Date().toTimeString()
                this.tasksOfThird.push(task)

                if (flag) {
                    for (problem of this.tasksOfFirst) {
                        count = 0;
                        for (point of problem.list) {
                            if (point.checked) count++;
                        }
                        let percents = 100 / problem.list.length * count
                        if (percents >= 50 && percents < 100) {
    
                            const idx = this.tasksOfFirst.indexOf(problem)
                            this.tasksOfFirst = this.tasksOfFirst.filter((value, index) => idx !== index)
                            problem.date = new Date().toDateString() + ' --- ' + new Date().toTimeString()
                            this.tasksOfSecond.push(problem)
                        } 
                    }
                }
            }
            localStorage.setItem('tasksOfFirst', JSON.stringify(this.tasksOfFirst))
            localStorage.setItem('tasksOfSecond', JSON.stringify(this.tasksOfSecond))
            localStorage.setItem('tasksOfThird', JSON.stringify(this.tasksOfThird))
            const tasksOfFirst = localStorage.getItem('tasksOfFirst');
            const tasksOfSecond = localStorage.getItem('tasksOfSecond');
            const tasksOfThird = localStorage.getItem('tasksOfThird');

            if (tasksOfFirst) this.tasksOfFirst = JSON.parse(tasksOfFirst);
            if (tasksOfSecond) this.tasksOfSecond = JSON.parse(tasksOfSecond);
            if (tasksOfThird) this.tasksOfThird = JSON.parse(tasksOfThird);
        }
    },
    mounted() {

        const tasksOfFirst = localStorage.getItem('tasksOfFirst');
        const tasksOfSecond = localStorage.getItem('tasksOfSecond');
        const tasksOfThird = localStorage.getItem('tasksOfThird');

        if (tasksOfFirst) this.tasksOfFirst = JSON.parse(tasksOfFirst);
        if (tasksOfSecond) this.tasksOfSecond = JSON.parse(tasksOfSecond);
        if (tasksOfThird) this.tasksOfThird = JSON.parse(tasksOfThird);

        setInterval(()=>{
            checksInSecond = document.getElementById('secondColumn').querySelectorAll('input[type="checkbox"]');
            checksInThird = document.getElementById('thirdColumn').querySelectorAll('input[type="checkbox"]');
            for (let i = 0;i < checksInSecond.length;++i) {
                if (checksInSecond[i].checked) {
                    checksInSecond[i].disabled = true
                }
            }
            for (let i = 0;i < checksInThird.length;++i) {
                if (checksInThird[i].checked) {
                    checksInThird[i].disabled = true
                }
            }
        }, 5)
        

        eventBus50.$on('on-check', this.handleOnCheck50),
        eventBus100.$on('on-check', this.handleOnCheck100)
    },
    computed: {

    }
});
