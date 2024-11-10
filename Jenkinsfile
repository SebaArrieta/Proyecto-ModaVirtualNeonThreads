pipeline {
    agent any
    stages {
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
                // Usa el objetivo `run` del Makefile para construir y levantar los contenedores
                sh 'make run'
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
