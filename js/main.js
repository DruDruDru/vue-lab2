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
            ID: 0,
        }
    },
    methods: {
        addToColumn(task) {
            if (this.addTask.length < 3) {
                this.addTask.push(
                    {
                        id: ++this.ID,
                        title: task.title,
                        list: [
                            { name: task.firstPoint, checked: false },
                            { name: task.secondPoint, checked: false },
                            { name: task.thirdPoint, checked: false }
                        ],
                    },
                )
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
            console.log(this.addTask);
        },
        moveToSecond(task) {
            eventBus50.$emit('on-check', task)
        },
        moveToThird(task) {
            eventBus100.$emit('on-check', task)
        }
    },
    computed: {
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

            <form @submit.prevent="onAddPoint(task.id)" v-show="click" >
                <input type="text" required v-model="point" />
                <input type="submit" value="Добавить" />
            </form>
        </div>
    `,
    
    methods: {
        isClick() {
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

            checkboxes = document.querySelectorAll('.checkboxInput')

            count = 0;
            for (point of this.task.list) {
                if (point.checked) count++;
            }
            let percents = 100 / this.task.list.length * count
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
        date() {
            cd = new Date()
            return 'Дата: ' + cd.getDate() + '.' + (String(cd.getMonth())+1) + '.' + cd.getFullYear() + ' Время: ' + cd.getHours() + ':' + cd.getMinutes()
        }
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
        editFirstColumn: true,
        editSecondColumn: false,
        editThirdColumn: false,
        tasksOfFirst: [
            {
                id: 0,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: false },
                    { name: 'Биология', checked : false }
                ],
            },
            {
                id: 2,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: false },
                    { name: 'Биология', checked : false }
                ],
            }
        ],
        tasksOfSecond: [
            {
                id: 3,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: true },
                    { name: 'Биология', checked : true }
                ],
            },
            {
                id: 4,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: false },
                    { name: 'Алгебра', checked: true },
                    { name: 'Биология', checked : true }
                ],
            }
        ],
        tasksOfThird: [
            {
                id: 5,
                title: 'Домашка',
                list: [
                    { name: 'Русский язык', checked: true },
                    { name: 'Алгебра', checked: true },
                    { name: 'Биология', checked : true }
                ],
            }
        ],
    },
    methods: {
        handleOnCheck50(task) {
            if (this.tasksOfFirst.includes(task) && !(this.tasksOfSecond.includes(task)) && (this.tasksOfSecond.length < 5)) {
                const idx = this.tasksOfFirst.indexOf(task)
                this.tasksOfFirst = this.tasksOfFirst.filter((value, index) => idx !== index)
                this.tasksOfSecond.push(task)
            }
        },
        handleOnCheck100(task) {
            if (this.tasksOfSecond.includes(task)) {
                const idx = this.tasksOfSecond.indexOf(task)
                this.tasksOfSecond = this.tasksOfSecond.filter((value, index) => idx !== index)
                this.tasksOfThird.push(task)
            }
        }
    },
    created() {
        eventBus50.$on('on-check', this.handleOnCheck50),
        eventBus100.$on('on-check', this.handleOnCheck100)
    }
});

