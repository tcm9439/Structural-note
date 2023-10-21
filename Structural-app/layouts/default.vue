<template>
    <div class="layout">
        <Layout>
            <mt-layout-header />
            <Content class="content">
                <slot />
            </Content>
        </Layout>
    </div>
</template>

<style scoped>
    .layout {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    :deep(.ivu-layout) {
        min-height: 100vh;
    }

    .content {
        margin: 10vh 20px 0;
        min-height: 100%;
    }
</style>