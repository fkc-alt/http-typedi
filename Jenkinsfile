pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                npm install --force
                echo 'Building...'
                sh 'make build2'  // Replace with your actual build command
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'make test'  // Replace with your actual test command
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'make deploy'  // Replace with your actual deploy command
            }
        }
    }
    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
