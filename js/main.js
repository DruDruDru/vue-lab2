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
            <card v-for="task in tasks" :key="task.id" :task="task">></card>
            <!--<add-card 
                v-if="canAdd" 
                @add-card-submitted="addToColumn"
                @add-point-submitted=""
            ></add-card>-->
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
                            { name: task.thirdPoint, checked : false }
                        ],
                    },
                )
            }
        },
        addToTask(point) {
            console.log(point);
        }
    },
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
                <button @click="onAddPoint" >+</button>
            </div>
            
            <div v-for="point in task.list">
                <input type="checkbox" id="..." name="..." value="..."/>
                <label for="...">{{ point.name }}</label>
            </div>
            <form @submit.prevent="onAddPoint" v-show="click" >
                <input type="text" v-model="point" />
                <input type="submit" value="Добавить">
            </form>
        </div>
    `,
    methods: {
        onAddPoint() {
            this.click = true
            this.point = point;
            if (this.point) {
                this.$emit('add-point-submitted', this.point);
                this.point = null;
            }
        },
    }
})

Vue.component('add-card', {
    template: `
        <form @submit.prevent="onSubmit" class="createTask">
            <input type="text" maxlength=50 required v-model="title" class="inputFortitle" />\
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
    }
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
            ],
            tasksOfSecond: [],
            tasksOfThird: [],
        }
    },
    methods: {

    }
});

