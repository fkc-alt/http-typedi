pipeline {
    agent any
    environment { 
      version = '1.0.0'
      projectName = 'http-typedi'
    }
    stages {
        stage('Build') {
            environment { 
                DEBUG_FLAGS = '-g'
            }
            steps {
                sh 'printenv'
            }
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