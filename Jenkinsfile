pipeline {
    agent any
    stages {
        stage('Use Environment Variables') {
            steps {
                script {
                    def envFile = '/var/jenkins_home/.env'
                    if (fileExists(envFile)) {
                        echo "Sourcing .env file..."
                        sh """
                            set -a
                            . ${envFile}
                            set +a
                        """
                        // Load environment variables from the .env file
                        def lines = readFile(envFile).split('\n')
                        lines.each { line ->
                            if (line.contains('=')) {
                                def (key, value) = line.split('=').collect { it.trim() }
                                env[key] = value
                            }
                        }
                        echo "Environment Variables Loaded:"
                        echo "AWS_ACCESS_KEY_ID=${env.AWS_ACCESS_KEY_ID}"
                        echo "AWS_SECRET_ACCESS_KEY=${env.AWS_SECRET_ACCESS_KEY}"
                        echo "AWS_REGION=${env.AWS_REGION}"
                    } else {
                        error ".env file not found!"
                    }
                }
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
                    echo "Running make with the following environment variables:"
                    echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
                    echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
                    echo "AWS_REGION=$AWS_REGION"
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
