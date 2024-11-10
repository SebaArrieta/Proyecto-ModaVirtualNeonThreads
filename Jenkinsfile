pipeline {
    agent any
    stages {
        stage('Use Environment Variables') {
            steps {
                sh '''
                    if [ -f /var/jenkins_home/.env ]; then
                        echo "Sourcing .env file..."
                        set -a
                        . /var/jenkins_home/.env
                        set +a
                        echo "Environment Variables Loaded:"
                        echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
                        echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
                        echo "AWS_REGION=$AWS_REGION"
                    else
                        echo ".env file not found!"
                        exit 1
                    fi
                '''
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'develop',
                    url: 'https://github.com/INF331-Equipo9/Proyecto-ModaVirtualNeonThreads.git',
                    credentialsId: 'github-pat'
            }
        }
        stage('Verify Workspace') {
            steps {
                sh 'pwd && ls -la'
            }
        }
        stage('Build and Run Application') {
            steps {
                sh '''
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                    export AWS_REGION=$AWS_REGION
                    make run
                '''
            }
        }
        stage('Run Unit Tests') {
            steps {
                // Usa el objetivo `Compra_test` del Makefile para ejecutar las pruebas unitarias
                sh 'make Compra_test'
            }
        }
        stage('Deploy') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Desplegando aplicación...'
                // Agrega el comando o script de despliegue aquí
            }
        }
    }
    post {
        always {
            echo 'Pipeline completado'
        }
        success {
            echo 'Despliegue y pruebas exitosas'
        }
        failure {
            echo 'Pipeline fallido, el despliegue no se realizó'
        }
    }
}
