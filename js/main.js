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
            <add-card v-if="canAdd" @add-card-submitted="addToColumn"></add-card>
        </div>
    `,
    data() {
        return {
            ID: 0,
        }
    },
    methods: {
        addToColumn(cardName) {
            if (this.addTask.length < 3) {
                this.addTask.push(
                    {
                        id: ++this.ID,
                        title: cardName,
                        list: [],
                    },
                )
            }
            console.log(this.addTask);
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
    template: `
        <div class="card">
            <h2>{{ task.title }}</h2>
            <div v-for="point in task.list">
                <input type="checkbox" id="..." name="..." value="..." />
                <label for="...">{{ point }}</label>
            </div>
        </div>
    `
})

Vue.component('add-card', {
    template: `
        <form @submit.prevent="onSubmit">
            <input type="text" maxlength=50 v-model="title" />
            <input type="submit" value="Добавить" />
        </form>
    `,
    data() {
        return {
            title: null,
        }
    },
    methods: {
        onSubmit() {
            this.$emit('add-card-submitted', this.title)
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
                        'Русский язык',
                        'Алгебра',
                        'Биология',
                    ],
                },
            ],
            tasksOfSecond: [],
            tasksOfThird: [],
        }
    },
});

