Vue.component('column', {
    template: `
        <div class="column">
            <card></card>
            <card></card>
            <card></card>
            <card></card>
            <card></card>
        </div>
    `
})

Vue.component('card', {
    template: `
        <div class="card">
            <h2>Test</h2>
            <p>list</p>
        </div>
    `
})

let app = new Vue({
    el: '#app',

});