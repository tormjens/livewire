import EventAction from "@/action/event";
import HookManager from "@/HookManager";
import DirectiveManager from "@/DirectiveManager";
import MessageBus from "./MessageBus";

const store = {
    componentsById: {},
    listeners: new MessageBus,
    livewireIsInBackground: false,
    livewireIsOffline: false,
    hooks: HookManager,
    directives: DirectiveManager,

    components() {
        return Object.keys(this.componentsById).map(key => {
            return this.componentsById[key]
        })
    },

    addComponent(component) {
        return this.componentsById[component.id] = component
    },

    findComponent(id) {
        return this.componentsById[id]
    },

    hasComponent(id) {
        return !! this.componentsById[id]
    },

    tearDownComponents() {
        this.components().forEach(component => {
            this.removeComponent(component)
        })
    },

    on(event, callback) {
        this.listeners.register(event, callback)
    },

    emit(event, ...params) {
        this.listeners.call(event, ...params)

        this.componentsListeningForEvent(event).forEach(
            component => component.addAction(new EventAction(
                event, params
            ))
        )
    },

    componentsListeningForEvent(event) {
        return this.components().filter(component => {
            return component.events.includes(event)
        })
    },

    registerDirective(name, callback) {
        this.directives.register(name, callback)
    },

    registerHook(name, callback) {
        this.hooks.register(name, callback)
    },

    callHook(name, ...params) {
        this.hooks.call(name, ...params)
    },

    removeComponent(component) {
        // Remove event listeners attached to the DOM.
        component.tearDown()
        // Remove the component from the store.
        delete this.componentsById[component.id]
    }
}

export default store
