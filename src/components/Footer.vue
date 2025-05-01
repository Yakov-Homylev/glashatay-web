<template>
    <footer class="footer">
        <div class="footer-block">
            <address class="footer-address">
                <p class="footer-text">Так же ищи наши вестовые доски:</p>
                <ul class="address-list">
                    <li class="address-item">У южных врат</li>
                    <li class="address-item">На торжище</li>
                    <li class="address-item">В корчме "У Добрыни"</li>
                </ul>
            </address>
        </div>
        <div class="footer-block footer-block-law">
            <p class="footer-text footer-text-law">
                Глашатай. <span class="seal">⳩</span> Всякая грамота сия оберегаема мечом княжим да благословением
                духовным.
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
@maxPhoneWidth: 800px;
.footer {
    display: flex;
    flex-direction: column;
    background-color: var(--color-primary);
    padding: 10px 20px;
    margin-top: auto;
}
.footer-block {
    display: flex;
    width: 100%;
}
.footer-address {
    margin-left: auto;

    @media screen and (max-width: @maxPhoneWidth) {
        margin: 0 auto;
    }
}
.address-list {
    border-left: 2px solid var(--color-gold);
    padding-left: 8px;
    list-style: none;

    .address-item {
        color: var(--color-white);
        font-size: var(--small-font-size);
        font-style: italic;
    }
}
.footer-text {
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    font-style: italic;
    color: var(--color-white);
}
.footer-block-law {
    margin-top: 12px;

    @media screen and (max-width: @maxPhoneWidth) {
        text-align: center;
    }
}
.footer-text-law {
    margin: 0 auto;
}
.seal {
    display: inline-block;
    font-size: var(--small-font-size);
    color: var(--color-gold-accent);

    animation: pulse 2000ms infinite;

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
}
</style>
