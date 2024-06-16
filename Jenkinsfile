pipeline {
    agent any
    environment { 
      VERSION = '1.0.0'
      PROJECT_NAME = 'http-typedi'
      GITHUB_SECRET = credentials('github_secret')
      NODE_VERSION = '18.20.3'
    }
    tools {
        nodejs 'Node 18.20.3'  // 这里的名称应与在 Jenkins 中配置的名称匹配
    }
    stages {
        stage('Prepare') {
            steps {
                sh 'npm config ls'
            }
        }
        stage('Install Packages') {
            steps {
                sh 'npm install --force'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
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