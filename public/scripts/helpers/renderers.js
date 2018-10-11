export default {
    renderEle(ind, ele, klass, pKlass) {
        let nEle = document.createElement(ele);
        document.querySelector(`${pKlass}`).appendChild(nEle);
        nEle.classList.add(`${klass}-${ind}`);
    
        return nEle;
    },
    renderListEle(item, i, pKlass) {
        let li = document.createElement('li');
        document.querySelector(pKlass).appendChild(li);
        
        const newLiKlass = `li-${i}`;
        li.classList.add(newLiKlass);

        let btn = document.createElement('button');
        document.querySelector(`.${newLiKlass}`).appendChild(btn);
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', item._id);
        btn.textContent = item.awesome_field;

        return li;
    }
}