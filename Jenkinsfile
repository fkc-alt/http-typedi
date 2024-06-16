pipeline {
    agent any
    environment { 
      version = '1.0.0'
      projectName = 'http-typedi'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                echo "Running ${BUILD_ID} on ${JENKINS_URL} ${projectName}-${version}"
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