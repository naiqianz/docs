ALL_DOCS := $(shell find . -name '*.md' -not -path './.github/*' -type f | grep -v ^./node_modules | sort)

TOOLS_DIR := ./internal/tools
MISSPELL_BINARY=bin/misspell
MISSPELL = $(TOOLS_DIR)/$(MISSPELL_BINARY)

all: misspell lint

lint:
	yarn lint:wording

.PHONY: install-misspell
install-misspell:
    # TODO: Check for existence before installing
	cd $(TOOLS_DIR) && go build -o $(MISSPELL_BINARY) github.com/client9/misspell/cmd/misspell

.PHONY: misspell
misspell:
	$(MISSPELL) -error $(ALL_DOCS)

.PHONY: markdown-link-check
markdown-link-check:
	@for f in $(ALL_DOCS); do yarn markdown-link-check --quiet --config .markdown_link_check_config.json $$f; done

# Run all checks in order of speed / likely failure.
.PHONY: check
check: misspell markdown-link-check
	@echo "All checks complete"
