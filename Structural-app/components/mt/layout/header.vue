<script setup lang="ts">
import { Icon } from "view-ui-plus"

const { $viewState } = useNuxtApp();
const view_state = ref($viewState);
</script>

<template>
    <Header class="header">
        <Space>
            <div class="white-text">NOTE</div>
            <div class="white-text">{{ view_state.editing_note_name }}</div>
            <Dropdown>
                <div class="white-text">
                    <Icon type="md-document" />
                    File
                    <Icon type="ios-arrow-down"></Icon>
                </div>
                <template #list>
                    <DropdownMenu>
                        <DropdownItem>ABC</DropdownItem>
                        <DropdownItem>CDE</DropdownItem>
                    </DropdownMenu>
                </template>
            </Dropdown>
            <Button>
                <Icon type="md-settings" />
                Setting
            </Button>
        </Space>
    </Header>
</template>

<style scoped>
    .header {
        position: fixed;
        width: 100%;
        z-index: 20;
    }
    
    .white-text {
        padding-right: 10px;
        color: #fff;
    }
</style>