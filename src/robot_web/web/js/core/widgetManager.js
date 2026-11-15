/******************************************************************************
 * RBT1 Robot Control Interface
 * core/widgetManager.js
 *
 * Widget Lifecycle Manager
 ******************************************************************************/

import { log } from "./utils.js";

/******************************************************************************
 * PRIVATE
 ******************************************************************************/

const pages = new Map();

/******************************************************************************
 * REGISTER
 ******************************************************************************/

export function registerWidget(page, container, widget) {

    if (!pages.has(page)) {

        pages.set(page, []);

    }

    pages.get(page).push({

        container,

        widget

    });

}

/******************************************************************************
 * MOUNT PAGE
 ******************************************************************************/

export function mountPage(page) {

    const widgets = pages.get(page);

    if (!widgets) return;

    widgets.forEach(entry => {

        const {

            container,
            widget

        } = entry;

        container.innerHTML = widget.create();

        widget.init(container);

        widget.render();

    });

    log(`🧩 Mounted page : ${page}`);

}

/******************************************************************************
 * UNMOUNT PAGE
 ******************************************************************************/

export function unmountPage(page) {

    const widgets = pages.get(page);

    if (!widgets) return;

    widgets.forEach(entry => {

        const {

            container,
            widget

        } = entry;

        widget.destroy();

        container.innerHTML = "";

    });

}

/******************************************************************************
 * RENDER PAGE
 ******************************************************************************/

export function renderPage(page) {

    const widgets = pages.get(page);

    if (!widgets) return;

    widgets.forEach(entry => {

        entry.widget.render();

    });

}

/******************************************************************************
 * DESTROY PAGE
 ******************************************************************************/

export function destroyPage(page) {

    unmountPage(page);

    pages.delete(page);

}

/******************************************************************************
 * RENDER ALL
 ******************************************************************************/

export function renderAllWidgets() {

    pages.forEach((widgets) => {

        widgets.forEach(entry => {

            entry.widget.render();

        });

    });

}

/******************************************************************************
 * DEBUG
 ******************************************************************************/

export function dumpWidgets() {

    console.group("WidgetManager");

    pages.forEach((widgets, page) => {

        console.log(page, widgets);

    });

    console.groupEnd();

}