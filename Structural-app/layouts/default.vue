<template>
    <div class="layout">
        <Layout>
            <mt-layout-header />
            <Content :style="{margin: '88px 20px 0', minHeight: '500px'}">
                <slot />
            </Content>
        </Layout>
    </div>
</template>

<style>
    .layout {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
</style>