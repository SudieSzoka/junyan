async function loadData() {
    try {
        // 加载文件列表
        const response = await fetch('scripts/datalist.json');
        const fileList = await response.json();
        
        // 读取所有文件内容
        const allData = await Promise.all(
            fileList.map(async filename => {
                const resp = await fetch(`data/${filename}`);
                return await resp.json();
            })
        );

        // 过滤出可显示的数据
        return allData.filter(item => item.canShow === 1);
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = `card ${item.isFinish === 1 ? 'finished' : 'unfinished'}`;
    
    card.innerHTML = `
        <h2>${item.name}</h2>
        <p>${item.desc}</p>
        <div class="date">创建时间: ${item.create_time}</div>
    `;

    card.addEventListener('click', () => {
        window.open(`detail.html?id=${item.index}`, '_blank');
    });

    return card;
}

function displayCards(data) {
    const finishedContainer = document.getElementById('finishedContainer');
    const unfinishedContainer = document.getElementById('unfinishedContainer');
    
    // 清空容器
    finishedContainer.innerHTML = '';
    unfinishedContainer.innerHTML = '';
    
    // 分类数据
    data.forEach(item => {
        const card = createCard(item);
        if (parseInt(item.isFinish) === 1) {
            finishedContainer.appendChild(card);
        } else {
            unfinishedContainer.appendChild(card);
        }
    });
}

function setupSearch(data) {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.desc.toLowerCase().includes(searchTerm)
        );
        displayCards(filtered);
    });
}

async function init() {
    const data = await loadData();
    displayCards(data);
    setupSearch(data);
}

init();