import type { StoreFaq } from "@/lib/types";

export const MAVI_SEO_ICERIK = `Mavi, Türkiye'nin önde gelen denim ve giyim markalarından biridir. Online alışverişlerinizde Mavi indirim kodları kullanarak sepet tutarınızdan anında indirim elde edebilirsiniz. Bu sayfada yer alan tüm Mavi kupon kodları düzenli olarak güncellenmekte ve doğrulanmaktadır.

Mavi indirim kodu nasıl kullanılır? Alışverişinizi tamamlarken ödeme adımında "İndirim Kodu" veya "Kupon Kodu" alanına ilgili kodu yapıştırmanız yeterlidir. Kod geçerliyse indirim tutarı otomatik olarak sepetinize yansır.

2026 yılında Mavi'de geçerli kampanyalar arasında sezon sonu indirimleri, yeni üye avantajları ve belirli tutar üzeri alışverişlerde geçerli kupon kodları bulunmaktadır. Aktif kuponları sayfanın üst kısmından inceleyebilir, "KODU AL" butonuna tıklayarak kodu kopyalayabilirsiniz.`;

export const MAVI_SSS: StoreFaq[] = [
  {
    id: "mavi-1",
    soru: "Mavi indirim kodu nasıl kullanılır?",
    cevap:
      "Mavi.com üzerinden alışveriş yaparken sepet adımında veya ödeme ekranında bulunan indirim kodu alanına kuponu yapıştırın ve uygula butonuna tıklayın. İndirim tutarı anında sepetinize yansır.",
  },
  {
    id: "mavi-2",
    soru: "Mavi kupon kodları ne kadar süre geçerlidir?",
    cevap:
      "Her kuponun başlangıç ve bitiş tarihi farklıdır. Aktif kuponların geçerlilik süreleri kupon kartlarında belirtilmiştir. Süresi dolmuş kuponlar artık kullanılamaz.",
  },
  {
    id: "mavi-3",
    soru: "Birden fazla Mavi indirim kodu aynı anda kullanılabilir mi?",
    cevap:
      "Genellikle bir siparişte yalnızca bir indirim kodu kullanılabilir. Kampanya koşulları kupon detaylarında açıklanmaktadır.",
  },
];

export function defaultSeoIcerik(storeAd: string): string {
  return `${storeAd} indirim kodları ve kampanyaları hakkında kapsamlı bilgileri bu sayfada bulabilirsiniz. ${storeAd} online alışverişlerinizde geçerli güncel kupon kodları düzenli olarak kontrol edilmekte ve listelenmektedir.

${storeAd} kupon kodu kullanmak için ilgili kodu kopyalayıp mağazanın ödeme sayfasındaki indirim kodu alanına yapıştırmanız yeterlidir. Kampanyalar ve indirim kodları belirli tarih aralıklarında geçerlidir; aktif kuponları sayfanın üst bölümünden takip edebilirsiniz.`;
}

export function defaultSss(storeAd: string): StoreFaq[] {
  const slug = storeAd.toLowerCase().replace(/\s+/g, "-");
  return [
    {
      id: `${slug}-sss-1`,
      soru: `${storeAd} indirim kodu nasıl kullanılır?`,
      cevap: `${storeAd} web sitesinde alışveriş yaparken sepet veya ödeme adımındaki indirim kodu alanına kuponu girin ve uygula butonuna tıklayın.`,
    },
    {
      id: `${slug}-sss-2`,
      soru: `${storeAd} kupon kodları ücretsiz mi?`,
      cevap: `Evet, bu sayfadaki tüm ${storeAd} indirim kodları tamamen ücretsizdir ve herhangi bir üyelik gerektirmez.`,
    },
  ];
}
