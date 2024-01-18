#!/bin/bash

filename="docker.env"

create_env_file() {
    if [ ! -e "$filename" ]; then
        touch "$filename"
        echo "Docker ENV file '$filename' created."
    else
        echo "Docker ENV file '$filename' already exists."
    fi
}

add_env_variable() {
    if grep -q "^$1=" "$filename"; then
        echo "Environment variable '$1' already exists in '$filename'."
    else
        echo "$1=$2" >> "$filename"
        echo "Environment variable '$1' added to '$filename'."
    fi
}

create_env_file
add_env_variable GOGC 50
