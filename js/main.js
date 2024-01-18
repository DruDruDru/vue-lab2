Vue.component('column', {   
    props: {
        tasks: {
            type: Array,
            required: false,
        },
        canAdd: {
            type: Boolean,
            required: true,
        },
        addTask: {
            type: Array,
            required: false,
        }
    },
    template: `
        <div class="column">
            <card 
                v-for="task in tasks" 
                :key="task.id" 
                :task="task"
                @add-point-submitted="addToTask"
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
        }
    },
    computed: {
        isDisplayForForm() {
            return this.addTask.length < 3
        }
    }
})

Vue.component('card', {
    props: {
        task: {
            type: Object,
            required: true
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
                <button type="button" @click="isClick" :disabled="isDisabled" >+</button>
            </div>
            
            <div v-for="point in task.list">
                <input type="checkbox" id="..." name="..." value="..."/>
                <label for="...">{{ point.name }}</label>
            </div>

            <form @submit.prevent="onAddPoint(task.id)" v-show="click" >
                <input type="text" required v-model="point" />
                <input type="submit" value="Добавить" />
            </form>
        </div>
    `,
    computed: {
        isDisabled() {
            return this.task.list.length >= 5;
        }
    },
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
    }
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
            <input type="text" maxlength=50 required v-model="title" class="inputFortitle" />
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

    data() {
        return {
            addInFirstColumn: true,
            addInSecondColumn: false,
            addInThirdColumn: false,
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
            tasksOfSecond: [],
            tasksOfThird: [],
        }
    },
    methods: {

    }
});

