url ='https://www.amazon.com/dp/{pid}/ref=cm_cr_arp_d_product_top?ie=UTF8&th=1'
for i in range(3, 4):
    print(url.split('/')[i])
    #//*[@id="poExpander"]/div[1]/div/table/tbody/tr[1]
    #//*[@id="poExpander"]/div[1]/div/table/tbody/tr[1]/td[1]/span
