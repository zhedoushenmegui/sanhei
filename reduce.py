

if __name__ == '__main__':
    newone = []
    # newone = ['隔三差五', ['隔', 'g', 'e', '2'], ['三', 's', 'an', '1'], ['差', 'ch', 'a', '4'], ['五', 'w', 'u', '3']]


    import os
    os.system('cp chengyu.js chengyu.py')
    os.system('cp chengyu.js chengyu.bak.js')
    from chengyu import wds, chengyu, singleDict
    if not newone:
        print("invalid newone, quit.")
        exit()
    if newone[0] in wds:
        print(f'{newone[0]} already exists, quit.')
        exit()
    wds.append(newone[0])
    for i in range(1, 5):
        singleDict[newone[i][0]] =newone[i]
    chengyu[newone[0]] = newone[1:]
    #
    with open('chengyu.js', 'w') as f:
        f.write(f"wds = {wds}\n")
        f.write(f"singleDict = {singleDict}\n")
        f.write(f"chengyu = {chengyu}\n")




