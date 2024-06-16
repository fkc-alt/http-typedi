pipeline {
    agent any
    environment { 
      VERSION = '1.0.0'
      PROJECT_NAME = 'http-typedi'
      GITHUB_SECRET = credentials('github_secret')
      NODE_VERSION = '18.20.3'
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    // 设置 Node.js 版本管理工具 (如 nvm 或 n)
                    sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash'
                    sh 'nvm install ${NODE_VERSION}'
                    sh 'nvm use ${NODE_VERSION}'
                    sh 'node -v'
                    // sh '. ~/.nvm/nvm.sh && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION}'
                }
            }
        }
        // stage('Install Packages') {
        //     steps {
        //         script {
        //             // 安装 npm 包
        //             sh '. ~/.nvm/nvm.sh && nvm use ${NODE_VERSION} && npm install --force'
        //         }
        //     }
        // }
        // stage('Build') {
        //     steps {
        //         script {
        //             // 执行构建任务
        //             sh '. ~/.nvm/nvm.sh && nvm use ${NODE_VERSION} && npm run build'
        //         }
        //     }
        // }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}