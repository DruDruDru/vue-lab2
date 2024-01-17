Vue.component('column', {   
    props: {
        tasks: {
            type: Array,
            required: true
        }
    }, 
    template: `
        <div class="column">
            <card v-for="task in tasks" :key="task.id" :task="task"></card>
        </div>
    `
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

let app = new Vue({
    el: '#app',

    data: {
        tasksOfFirst: [
            {
                id: 1,
                title: 'Домашка',
                list: [
                    'Русский язык',
                    'Алгебра',
                    'Биология',
                ],
            },
            {
                id: 2,
                title: 'TITLE',
                list: [
                    'task1',
                    'task2',
                    'task3',
                ],
            },
            {
                id: 3,
                title: 'TITLE',
                list: [
                    'task1',
                    'task2',
                    'task3',
                ],
            }
        ],
        tasksOfSecond: [
            {
                id: 4,
                title: 'TITLE',
                list: [
                    'task1',
                    'task2',
                    'task3',
                ],
            },
            {
                id: 5,
                title: 'TITLE',
                list: [
                    'task1',
                    'task2',
                    'task3',
                ],
            },
            {
                id: 6,
                title: 'Домашка',
                list: [
                    'Русский язык',
                    'Алгебра',
                    'Биология',
                ],
            },
        ],
        tasksOfThird: [
            {
                id: 7,
                title: 'TITLE',
                list: [
                    'task1',
                    'task2',
                    'task3',
                ],
            },
            {
                id: 8,
                title: 'Домашка',
                list: [
                    'Русский язык',
                    'Алгебра',
                    'Биология',
                ],
            },
            {
                id: 9,
                title: 'TITLE',
                list: [
                    'task1',
                    'task2',
                    'task3',
                ],
            }
        ],
    }
});
