import React from 'react';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const collections = [
    { title: 'Festive Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997162/unnamed_m26syz.jpg' },
    { title: 'Banarasi Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996662/unnamed_nweur7.jpg' },
    { title: 'Kalamkari Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994621/Gemini_Generated_Image_ypuu4gypuu4gypuu_jgplbq.png' },
    { title: 'Kanjivaram Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761990540/kanjivaram_sarees_pva3cp.png' },
    { title: 'Block Printed Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993746/Block_Printed_Cotton_Saree_zrlik4.png' },
    { title: 'Kalamkari Print Saree', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991964/Kalamkari_print_saree_uvhwhn.png' },
    { title: 'Jaipur Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993092/Jaipur_Cotton_Saree_c4ccke.png' },
    { title: 'Banarasi Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761990705/banarasi_Silk_sarees_epyjj6.png' },
    { title: 'Maheshwari Silk', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991095/dark_green_maheshwarisilk_j9ucs1.png' },
    { title: 'Raw Silk Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991311/raw_silk_saree_gtxu2q.png' },
    { title: 'Mysore Silk Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991488/Mysore_silk_saree_zwuo1o.png' },
    { title: 'Sambalpuri Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991818/Sambalpuri_silk_saree_sezvhm.png' },
    { title: 'Bengali Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761992179/Bengali_cotton_saree_ghyp46.png' },
    { title: 'Maheshwari Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761992993/Maheshwari_Cotton_Saree_hhsdzs.png' },
    { title: 'South Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993328/South_Cotton_Saree_gmvokv.png' },
    { title: 'Soft Silk Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761990337/Gemini_Generated_Image_3yz9wj3yz9wj3yz9_jr5cy8.png' },
    { title: 'Dr.Khadi Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993662/Dr._Khadi_Cotton_Saree_iif3wn.png' },
    { title: 'Office Wear Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993480/office_wear_cotton_saree_pzlnyb.png' },
    { title: 'Bagru Print Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994151/Bagru_Print_Cotton_Saree_ibrwzw.png' },
    { title: 'Ajrakh Print Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994342/Ajrakh_Print_Cotton_Saree_vcfkoa.png' },
    { title: 'Ikkat Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994418/Ikkat_Cotton_Saree_w6emmp.png' },
    { title: 'Chanderi Cotton Silks', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994468/Chanderi_Cotton_Silk_Saree_rcx5uv.png' },
    { title: 'Sambalpuri Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994816/unnamed_l4uhvn.jpg' },
    { title: 'Kanjivaram Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761995049/unnamed_uomk5c.jpg' },
    { title: 'Bengali Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761995480/unnamed_ay9pzh.jpg' },
    { title: 'Mysore Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761995976/unnamed_zspfo7.jpg' },
    { title: 'Maheshwari Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996225/unnamed_y9lset.jpg' },
    { title: 'Karnataka Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996282/unnamed_jbpm5m.jpg' },
    { title: 'Tamilnadu Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996401/unnamed_f2zbf0.jpg' },
    { title: 'Banarasi Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996513/unnamed_nhbaqo.jpg' },
    { title: 'Banarasi Regional Dupatta', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996591/unnamed_raauh8.jpg' },
    { title: 'Banarasi Dupatta', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996738/unnamed_pbqdiz.jpg' },
    { title: 'Banarasi Dress Material', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996926/unnamed_bx15sw.jpg' },
    { title: 'Party Wear Saree', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996980/unnamed_somess.jpg' },
    { title: 'Bollywood Style Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997249/unnamed_y1gor8.jpg' },
    { title: 'Heavy Embroidered Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997328/unnamed_lltvbe.jpg' },
    { title: 'Floral Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997427/unnamed_taunb5.jpg' },
    { title: 'Digital Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997506/unnamed_s493zy.jpg' },
    { title: 'Block Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761999851/unnamed_kpla93.jpg' },
    { title: 'Abstract Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761999860/unnamed_hv6m97.jpg' },
    { title: 'Geometric Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761999983/unnamed_q6ef6r.jpg' },
  ];

  const navigate = useNavigate();

  // Map each card title to the exact route defined in Header.jsx
  const pathByTitle = {
    // Silk
    'Soft Silk Sarees': '/category/silk/soft-silk',
    'Kanjivaram Sarees': '/category/silk/kanjivaram',
    'Banarasi Sarees': '/category/banarasi/banarasi-sarees',
    'Maheshwari Silk': '/category/silk/maheshwari',
    'Raw Silk Sarees': '/category/silk/raw-silk',
    'Mysore Silk Sarees': '/category/silk/mysore-silk',
    'Sambalpuri Sarees': '/category/silk/sambalpuri-sarees',
    'Kalamkari Print Saree': '/category/silk/kalamkari-print-saree',

    // Cotton
    'Bengali Cotton Sarees': '/category/cotton/bengali-sarees',
    'Maheshwari Cotton Sarees': '/category/cotton/maheshwari-cotton',
    'Jaipur Cotton Sarees': '/category/cotton/jaipur-cotton',
    'South Cotton Sarees': '/category/cotton/south-cotton-sarees',
    'Office Wear Cotton Sarees': '/category/cotton/office-wear-sarees',
    'Dr.Khadi Cotton Sarees': '/category/cotton/dr-khadi',
    'Block Printed Cotton Sarees': '/category/cotton/block-printed-sarees',
    'Bagru Print Cotton Sarees': '/category/cotton/bagru-print-sarees',
    'Ajrakh Print Cotton Sarees': '/category/cotton/ajrakh-print-sarees',
    'Ikkat Cotton Sarees': '/category/cotton/ikkat-sarees',
    'Chanderi Cotton Silks': '/category/cotton/chanderi-cotton-silks',
    'Kalamkari Cotton Sarees': '/category/cotton/kalamkari-sarees',

    // Regional
    'Sambalpuri Regional Sarees': '/category/regional/sambalpuri-sarees',
    'Kanjivaram Regional Sarees': '/category/regional/kanjivaram-sarees',
    'Bengali Regional Sarees': '/category/regional/bengali-sarees',
    'Mysore Regional Sarees': '/category/regional/mysore-sarees',
    'Maheshwari Regional Sarees': '/category/regional/maheshwari-sarees',
    'Karnataka Regional Sarees': '/category/regional/karnataka-sarees',
    'Tamilnadu Regional Sarees': '/category/regional/tamilnadu-sarees',
    'Banarasi Regional Sarees': '/category/regional/banarasi-sarees',
    'Banarasi Regional Dupatta': '/category/regional/banarasi-dupatta',

    // Banarasi
    'Banarasi Dupatta': '/category/banarasi/banarasi-dupatta',
    'Banarasi Dress Material': '/category/banarasi/banarasi-dress-material',

    // Designer Sarees
    'Party Wear Saree': '/category/designer-sarees/party-wear',
    'Wedding Sarees': '/category/designer-sarees/wedding',
    'Festive Sarees': '/category/designer-sarees/festive',
    'Bollywood Style Sarees': '/category/designer-sarees/bollywood-style',
    'Heavy Embroidered Sarees': '/category/designer-sarees/heavy-embroidered',

    // Printed Sarees
    'Floral Printed Sarees': '/category/printed-sarees/floral',
    'Digital Printed Sarees': '/category/printed-sarees/digital',
    'Block Printed Sarees': '/category/printed-sarees/block',
    'Abstract Printed Sarees': '/category/printed-sarees/abstract',
    'Geometric Printed Sarees': '/category/printed-sarees/geometric',
  };

  const onCardClick = (title) => {
    const path = pathByTitle[title];
    if (path) navigate(path);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-light text-gray-800 tracking-wide mb-3">
            CHOOSE YOUR SAREE ONLINE
          </h2>
          <p className="text-gray-500 text-sm">Discover our exclusive collection of handpicked sarees</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
              onClick={() => onCardClick(item.title)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-4 bg-white">
                <h3 className="text-sm font-medium tracking-wide text-gray-800 text-center">
                  {item.title}
                </h3>
              </div>
              
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
