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

calculate_ram() {
    if [ "$(uname)" == "Darwin" ]; then
        total_ram_kb=$(sysctl -n hw.memsize)
        total_ram_kb=$(($total_ram_kb / 1024))
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
        total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    else
        echo "Unsupported operating system while calculating the RAM"
        exit 1
    fi

    total_ram_mib=$((total_ram_kb / (1024)))
    echo "Total RAM: ${total_ram_mib}MiB"
    ninety_percent_ram=$((total_ram_mib * 90 / 100))
    echo "90% of Total RAM: ${ninety_percent_ram}MiB"

    add_env_variable GOMEMLIMIT ${ninety_percent_ram}MiB
}

create_env_file
add_env_variable GOGC 50
calculate_ram
