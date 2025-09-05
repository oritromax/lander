#!/bin/bash
set -e


RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 


print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}


if [ $# -eq 0 ]; then
    print_error "Please provide a version number"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

VERSION=$1


if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)?(\+[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)?$ ]]; then
    print_error "Invalid version format. Please use semantic versioning (e.g., 1.0.0)"
    exit 1
fi

print_info "Creating release for version $VERSION"


if ! git diff-index --quiet HEAD --; then
    print_error "Working directory is not clean. Please commit or stash your changes."
    exit 1
fi


print_info "Updating package.json version to $VERSION"
npm version $VERSION --no-git-tag-version


print_info "Creating release commit"
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"


print_info "Creating and pushing tag v$VERSION"
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin main
git push origin "v$VERSION"

print_info "✅ Release $VERSION created successfully!"
print_info "GitHub Actions will now build and publish the Docker image to GHCR"
print_info "Monitor the progress at: https://github.com/$(git remote get-url origin | sed 's|git@github.com:||' | sed 's|https://github.com/||' | sed 's|.git||')/actions"