<template>
    <div class="layout">
        <Layout>
            <mt-layout-header />
            <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px'}">
                <slot />
            </Content>
        </Layout>
    </div>
</template>

<style>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
</style>