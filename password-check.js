// 密码验证相关变量
let isAuthenticated = false;
let validPasswords = {};

// 加载密码配置
async function loadPasswordConfig() {
    try {
        const response = await fetch('/password.json');
        validPasswords = await response.json();
    } catch (error) {
        console.error('加载密码配置失败:', error);
    }
}

// 验证密码
function validatePassword(event) {
    event.preventDefault();
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (validPasswords[password] !== undefined) {
        // 密码正确
        isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authTimestamp', Date.now().toString());
        
        // 隐藏密码模态框，显示网站内容
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('websiteContent').style.display = 'block';
        
        // 初始化网站功能
        if (typeof initializeWebsite === 'function') {
            initializeWebsite();
        }
    } else {
        // 密码错误
        errorMessage.style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// 检查是否已认证
function checkAuthentication() {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const authTimestamp = localStorage.getItem('authTimestamp');
    const currentTime = Date.now();
    
    // 检查认证是否在24小时内有效
    if (savedAuth === 'true' && authTimestamp) {
        const timeDiff = currentTime - parseInt(authTimestamp);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            isAuthenticated = true;
            document.getElementById('passwordModal').style.display = 'none';
            document.getElementById('websiteContent').style.display = 'block';
            if (typeof initializeWebsite === 'function') {
                initializeWebsite();
            }
            return;
        }
    }
    
    // 未认证或认证已过期
    isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');
    document.getElementById('passwordModal').style.display = 'flex';
    document.getElementById('websiteContent').style.display = 'none';
}

// 创建密码验证模态框
function createPasswordModal() {
    const modalHTML = `
        <div id="passwordModal" class="password-modal">
            <div class="password-content">
                <div class="mb-6">
                    <img src="/res/pyq/junyan.png" alt="君言工具站" class="w-20 h-20 mx-auto mb-4">
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        君言工具站
                    </h1>
                    <p class="text-gray-600">请输入访问密码</p>
                </div>
                
                <form id="passwordForm" onsubmit="validatePassword(event)">
                    <input type="password" id="passwordInput" class="password-input" placeholder="请输入密码..." required>
                    <div id="errorMessage" class="error-message">密码错误，请重试</div>
                    <button type="submit" class="neumorphic-btn px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-medium w-full">
                        验证密码
                    </button>
                </form>
                
                <div class="mt-6 text-sm text-gray-500">
                    <p>加入君言会员群获取密码</p>
                    <p>联系微信：trychatting</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', modalHTML);
}

// 添加密码验证样式
function addPasswordStyles() {
    const styleHTML = `
        <style>
            /* 密码验证模态框样式 */
            .password-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(145deg, #e6e6e6, #ffffff);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .password-content {
                background: linear-gradient(145deg, #ffffff, #e6e6e6);
                box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
                border-radius: 2rem;
                padding: 3rem;
                text-align: center;
                max-width: 500px;
                width: 90%;
            }

            .password-input {
                background: linear-gradient(145deg, #ffffff, #e6e6e6);
                box-shadow: inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff;
                border: none;
                border-radius: 1rem;
                padding: 1rem 1.5rem;
                width: 100%;
                margin: 1.5rem 0;
                font-size: 1.1rem;
                transition: all 0.3s ease;
            }

            .password-input:focus {
                box-shadow: inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff;
                outline: none;
            }

            .error-message {
                color: #ef4444;
                font-size: 0.9rem;
                margin-top: 0.5rem;
                display: none;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styleHTML);
}

// 初始化密码验证
function initPasswordCheck() {
    addPasswordStyles();
    createPasswordModal();
    loadPasswordConfig().then(() => {
        checkAuthentication();
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initPasswordCheck();
}); 