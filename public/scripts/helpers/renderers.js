export default {
    renderEle(ind, ele, klass, pKlass) {
        let nEle = document.createElement(ele);
        document.querySelector(`${pKlass}`).appendChild(nEle);
        nEle.classList.add(`${klass}-${ind}`);
    
        return nEle;
    }
}