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
               nodejs(nodeJSInstallationName: 'Node 18') {
                    sh 'npm config ls'
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