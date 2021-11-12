SHELL := /bin/bash

# Terminal colors
COLOR_DEFAULT = \033[0;39m
COLOR_ERROR   = \033[0;31m
COLOR_INFO    = \033[0;36m
COLOR_RESET   = \033[0m
COLOR_SUCCESS = \033[0;32m
COLOR_WARNING = \033[0;33m

# Get local user ids
DOCKER_UID              = $(shell id -u)
DOCKER_GID              = $(shell id -g)

# Docker
COMPOSE          = \
  DOCKER_UID=$(DOCKER_UID) \
  DOCKER_GID=$(DOCKER_GID) \
  docker-compose

COMPOSE_RUN      = $(COMPOSE) run --rm -e HOME="/tmp"
COMPOSE_EXEC     = $(COMPOSE) exec

bootstrap: \
  clean \
  build
bootstrap:  ## install development dependencies
.PHONY: bootstrap

clean: \
  stop
clean:  ## Remove postgreSQL databases
	@rm -fr ./data/postgres
	$(COMPOSE) rm postgres
.PHONY: clean

# Build production image. Note that the cms service uses the same image built
# for the lms service.
build: \
  info
build:  ## build the nextjs production image
	@echo "🐳 Building production image..."
	$(COMPOSE) build nextjs
.PHONY: build

logs:  ## get development logs
	$(COMPOSE) logs -f
.PHONY: logs

up: \
  info
up:  ## start production image
	$(COMPOSE) up -d nextjs
.PHONY: up

dev: \
  info
dev:  ## start dev image
	$(COMPOSE) up nextjs-dev
.PHONY: dev

down:  ## down the development servers
	$(COMPOSE) down
.PHONY: stop

stop:  ## stop the development servers
	$(COMPOSE) stop
.PHONY: stop

info:  ## get activated release info
	@echo -e "\n.:: DEMO-DOCKER ::.\n";
	@echo -e "== Active configuration ==\n";
	@echo -e "* NODE_ENV          : $(COLOR_INFO)$(NODE_ENV)$(COLOR_RESET)";
	@echo -e "* DOCKER_UID        : $(COLOR_INFO)$(DOCKER_UID)$(COLOR_RESET)";
	@echo -e "* DOCKER_GID        : $(COLOR_INFO)$(DOCKER_GID)$(COLOR_RESET)";
	@echo -e "* DATABASE_URL      : $(COLOR_INFO)$(DATABASE_URL)$(COLOR_RESET)";
	@echo -e "* DOMAIN            : $(COLOR_INFO)$(DOMAIN)$(COLOR_RESET)";
	@echo -e "* SESSION_SECRET    : $(COLOR_INFO)$(SESSION_SECRET)$(COLOR_RESET)";
	@echo -e "* COOKIE_NAME       : $(COLOR_INFO)$(COOKIE_NAME)$(COLOR_RESET)";
	@echo -e "* POSTGRES_HOST     : $(COLOR_INFO)$(POSTGRES_HOST)$(COLOR_RESET)";
	@echo -e "* POSTGRES_PORT     : $(COLOR_INFO)$(POSTGRES_PORT)$(COLOR_RESET)";
	@echo -e "* POSTGRES_USER     : $(COLOR_INFO)$(POSTGRES_USER)$(COLOR_RESET)";
	@echo -e "* POSTGRES_PASSWORD : $(COLOR_INFO)$(POSTGRES_PASSWORD)$(COLOR_RESET)";
	@echo -e "* POSTGRES_DB       : $(COLOR_INFO)$(POSTGRES_DB)$(COLOR_RESET)";
	@echo -e "* LOGGING           : $(COLOR_INFO)$(LOGGING)$(COLOR_RESET)";
	@echo -e "* SYNCHRONIZE       : $(COLOR_INFO)$(SYNCHRONIZE)$(COLOR_RESET)";
	@echo -e "";
.PHONY: info

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help