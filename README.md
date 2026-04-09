# 💌 AmorLink - The Ultimate SaaS for Couples

![AmorLink Banner](https://via.placeholder.com/1000x300/ffe4e1/ff69b4?text=AmorLink+-+Connecting+Couples) <!-- Você pode trocar pelo caminho da sua logo futuramente -->

Bem-vindo ao repositório oficial do **AmorLink**, uma plataforma SaaS moderna e inovadora desenvolvida para fortalecer e celebrar a união de casais. O sistema fornece ferramentas interativas para acompanhar datas especiais, registrar memórias e interagir por meio de um sistema lúdico de amor e reconhecimento.

## ✨ Funcionalidades Principais

- **🔒 Arquitetura SaaS Multi-Tenant:** Isolamento completo de dados utilizando a entidade `Couple`, garantindo que cada casal acesse apenas o seu universo, com total segurança e privacidade.
- **⏱️ Linha do Tempo e Contadores:** Acompanhamento do tempo total de relacionamento e registro de momentos históricos de forma interativa.
- **🎫 Sistema Lúdico de Cupons:** Os casais podem resgatar e utilizar cupons de experiências ("Vale um Jantar Especial", "Vale Massagem", etc.).
- **🔐 Controle de Acesso (RBAC):** Autenticação escalável baseada em JWT, oferecendo papéis distintos como "Membro do Casal" (USER) e "Gestão do SaaS" (SUPER_ADMIN).
- **💳 Preparado para Assinaturas:** Estrutura backend idealizada para expansão de planos e features Premium.

---

## 🛠️ Stack de Tecnologia

Este projeto adota uma arquitetura de Monorepo Lógico separando claramente as responsabilidades de Frontend e Backend.

### Backend (`/amor-api`)
- **[Java 17+](https://adoptium.net/)** e **Spring Boot 3**
- Autenticação avançada utilizando **Spring Security** e **JWT**
- Banco de Dados Relacional: **PostgreSQL**
- Gerenciador de Dependências: **Maven**

### Frontend (`/amor-app`)
- **[React.js](https://react.dev/)**
- Construído e otimizado com **Vite**
- Estilização rápida e responsiva utilizando **Tailwind CSS**
- Ícones via **Lucide-React**

---

## 🚀 Como Executar Localmente

### Pré-requisitos Principais
- JDK 17 ou superior
- Node.js (v18+) e NPM
- Instância do PostgreSQL em execução

### 1. Configurando e Iniciando a API (Backend)
Primeiro, navegue para a pasta da API, configure o arquivo `.env` para apontar para seu banco de dados, e execute a aplicação Spring Boot:
```bash
cd amor-api
# Rode utilizando o Maven Wrapper
./mvnw spring-boot:run
```
> O backend iniciará na porta `8080`.

### 2. Configurando e Iniciando o App (Frontend)
Em um novo terminal, entre na pasta do frontend, instale os pacotes e inicie o Vite:
```bash
cd amor-app
npm install
npm run dev
```
> O frontend iniciará na porta `5173` (ou acessível via link no terminal).

---

## ⚖️ Aviso Legal e Licenciamento

Este repositório é **público** como forma de portfólio. Contudo, todos os algoritmos, ideias de produto SaaS, e estruturas de software estão protegidos pelos direitos originais do autor. 

**É estritamente proibido:**
- Clonar este projeto para hospedar e oferecer uma versão comercial concorrente.
- Modificar o código para lançar uma plataforma gratuita contornando a estrutura de negócio idealizada neste SaaS.
- Qualquer distribuição com ganho predatório sobre o código.

Qualquer uso que não se enquadre em aprendizado pessoal requer permissão explícita.
