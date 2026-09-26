package com.amorena;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada da API Amorena Moda Feminina.
 * A implementação das entidades, repositórios, serviços e controllers
 * será entregue na FASE 2 do projeto.
 * Este arquivo existe para fixar a estrutura de pacotes e permitir
 * que o build (Maven) já seja executado sem erros a partir da Fase 1.
 */
@SpringBootApplication
public class AmorenaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AmorenaApplication.class, args);
    }
}
