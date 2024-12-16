async function loadDetailData() {
    try {
        // 获取URL中的id参数
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (!id) {
            throw new Error('未找到ID参数');
        }

        // 加载文件列表
        const response = await fetch('scripts/datalist.json');
        const fileList = await response.json();
        
        // 添加调试日志
        console.log('File list:', fileList);
        
        // 读取所有文件内容
        const allData = await Promise.all(
            fileList.map(async filename => {
                const resp = await fetch(`data/${filename}`);
                const data = await resp.json();
                console.log(`Data from ${filename}:`, data); // 添加调试日志
                return data;
            })
        );

        console.log('All data:', allData); // 添加调试日志
        console.log('Looking for ID:', id, 'Type:', typeof id); // 检查ID类型

        // 修改查找逻辑，确保类型匹配
        const item = allData.find(item => {
            console.log('Comparing:', item.index, parseInt(id)); // 添加调试日志
            return item.index == id && item.canShow === 1; // 使用宽松比较
        });
        
        if (!item) {
            throw new Error('未找到对应数据');
        }

        return item;
    } catch (error) {
        console.error('Error loading detail data:', error);
        // 添加更详细的错误信息
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        return null;
    }
}

function renderDetail(item) {
    const container = document.getElementById('detailContainer');
    
    if (!item) {
        container.innerHTML = '<div class="error">加载数据失败</div>';
        return;
    }

    container.innerHTML = `
        <div class="detail-card ${item.isFinish ? 'finished' : 'unfinished'}">
            <h1>${item.name}</h1>
            <div class="meta-info">
                <p>创建时间: ${item.create_time}</p>
                <p>状态: ${item.isFinish ? '已完成' : '未完成'}</p>
            </div>
            <div class="description">
                <h2>描述</h2>
                <p>${item.desc}</p>
            </div>
            <div class="description">
                <h2>链接</h2>
                <a href="${item.link}">前往</a>
            </div>
            ${item.content ? `
                <div class="content">
                    <h2>详细内容</h2>
                    <div>${item.content}</div>
                </div>
            ` : ''}
        </div>
    `;
}

async function init() {
    const data = await loadDetailData();
    renderDetail(data);
}

init();