/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.91891891891892, "KoPercent": 1.0810810810810811};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7431621080720481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b697ece-84ef-4c6c-819d-d0aa63dee810"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e167bc1-ae6d-4ae1-8c09-9055c252553e"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a61f6d6-8e96-4ee8-b204-a304ec6de700"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2115949-d860-4a88-8004-b686d73c9a48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/21eeb484-2063-4024-90e9-06b8d494979e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44eb4d7a-1d41-4522-9137-a5d374fa895e"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eb76b235-766e-4f3c-8c03-d713f9333335"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=147dfd27-99a0-44af-9b94-62a177131c14"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e503b05-4a71-4736-9537-b1b5f49a92de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da1610ad-5e7a-4200-89f5-a41c6557dcfa"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa6e53ad-7659-4b20-8a35-2219a59764fc"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab42d758-5b55-4a76-8cb1-6fc8f7b353a5"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa9ecb6e-3bf5-45be-8c90-42741d1c3081"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21eeb484-2063-4024-90e9-06b8d494979e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a61f6d6-8e96-4ee8-b204-a304ec6de700"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28e26b81-57da-4990-8c98-f3cb558f5f08"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e167bc1-ae6d-4ae1-8c09-9055c252553e"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c376d2c-3964-43f1-b423-57e3ce254997"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9476744186046512, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b2a792e6-2d83-49d4-963f-8dbe761c6269"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/147dfd27-99a0-44af-9b94-62a177131c14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da1610ad-5e7a-4200-89f5-a41c6557dcfa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44eb4d7a-1d41-4522-9137-a5d374fa895e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2115949-d860-4a88-8004-b686d73c9a48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dadfa0aa-fd4c-4c4c-99ef-7f1bf5c7ba02"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b697ece-84ef-4c6c-819d-d0aa63dee810"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/561d1f78-1040-4703-a875-9110db53451d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb76b235-766e-4f3c-8c03-d713f9333335"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa9ecb6e-3bf5-45be-8c90-42741d1c3081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab42d758-5b55-4a76-8cb1-6fc8f7b353a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 14, 1.0810810810810811, 474.8362934362938, 135, 3111, 155.0, 1353.2000000000003, 1620.2, 2184.5999999999995, 5.12749445676275, 723.3588174282844, 3.7464217970482263], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2338.0689655172414, 1664, 3683, 2251.0, 2779.1, 3209.0999999999995, 3683.0, 0.2613566211095039, 314.5001139210703, 1.2850884641468283], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0b697ece-84ef-4c6c-819d-d0aa63dee810", 3, 0, 0.0, 360.3333333333333, 263, 514, 304.0, 514.0, 514.0, 514.0, 0.033678349311839065, 0.028076254097532498, 0.02159711853656346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e167bc1-ae6d-4ae1-8c09-9055c252553e", 1, 0, 0.0, 2276.0, 2276, 2276, 2276.0, 2276.0, 2276.0, 2276.0, 0.43936731107205623, 0.07937788334797892, 0.3029231656414763], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 860.1666666666666, 147, 2218, 883.0, 1858.9000000000012, 2218.0, 2218.0, 0.06417970316887284, 0.012206051945447252, 0.043366217074475195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 860.1666666666666, 147, 2218, 883.0, 1858.9000000000012, 2218.0, 2218.0, 0.0635219759569321, 0.012080961735949733, 0.042921790883008404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 172.64705882352942, 135, 422, 140.0, 413.2, 422.0, 422.0, 0.09169660291055805, 0.04073882852195864, 0.05138970921389042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 158.7058823529412, 135, 421, 142.0, 208.19999999999982, 421.0, 421.0, 0.09169610830928558, 0.06814525236656867, 0.04602714811618436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 286.4117647058824, 136, 1086, 142.0, 872.3999999999999, 1086.0, 1086.0, 0.09169462453748152, 3.1937204015145797, 0.05306889603717408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 392.05882352941177, 137, 1618, 144.0, 1564.3999999999999, 1618.0, 1618.0, 0.09155930888879314, 9.714154446416261, 0.05290116778512646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a61f6d6-8e96-4ee8-b204-a304ec6de700", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 287.9166666666667, 140, 450, 259.5, 435.6, 450.0, 450.0, 0.06418588231518478, 0.14145130965944042, 0.041489946551880916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2115949-d860-4a88-8004-b686d73c9a48", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 143.5333333333333, 137, 150, 144.0, 148.8, 150.0, 150.0, 0.11629529701818858, 0.08642648538168117, 0.058374787761082944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 159.4, 137, 416, 142.0, 253.4000000000001, 416.0, 416.0, 0.11630341234211812, 0.04276573391329968, 0.06567811189163622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1019.0, 811, 1128, 1118.0, 1128.0, 1128.0, 1128.0, 0.044472775249418145, 13.07647255844464, 0.02536337963443379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1302.3333333333333, 1234, 1393, 1280.0, 1393.0, 1393.0, 1393.0, 0.0441956393635828, 39.76731398699912, 0.025162165770477314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 424.0, 416, 429, 427.0, 429.0, 429.0, 429.0, 0.04472605292582929, 0.07914414834140887, 0.024765304696235557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 177.46666666666664, 137, 415, 143.0, 411.4, 415.0, 415.0, 0.07775203321566859, 0.05778251687219121, 0.03902787604770865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 197.60000000000002, 137, 435, 142.0, 426.6, 435.0, 435.0, 0.07775364535007283, 0.028590663342266363, 0.043908536443133576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 311.73333333333335, 137, 1577, 142.0, 892.4000000000004, 1577.0, 1577.0, 0.07775445144234507, 4.683799576562217, 0.04526564484358396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 298.4666666666667, 136, 1148, 144.0, 714.8000000000002, 1148.0, 1148.0, 0.07775646674615105, 1.5437594765693847, 0.04534275212534342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21eeb484-2063-4024-90e9-06b8d494979e", 2, 0, 0.0, 486.5, 402, 571, 486.5, 571.0, 571.0, 571.0, 0.01469928928936286, 0.029054063986006275, 0.009136814094413534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 239.0, 142, 433, 142.0, 433.0, 433.0, 433.0, 0.04491757624758568, 0.03338112844180928, 0.02522227181871266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 246.86666666666665, 137, 1472, 140.0, 834.8000000000004, 1472.0, 1472.0, 0.11630792134482973, 7.006196849703028, 0.06770998910582471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1290.8461538461538, 140, 1912, 1605.0, 1873.2, 1912.0, 1912.0, 0.08566269982472094, 59.29721116432082, 0.044697499472844925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 210.46666666666667, 138, 1185, 141.0, 560.4000000000003, 1185.0, 1185.0, 0.11630341234211812, 2.309061901522024, 0.06782094168934583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 842.2307692307693, 140, 1248, 848.0, 1247.2, 1248.0, 1248.0, 0.0856632642975283, 19.380592822736347, 0.04478144953774785], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 612.7500000000001, 146, 2276, 497.5, 1775.9000000000017, 2276.0, 2276.0, 0.06366892160764027, 0.012108908674890569, 0.043518495490118055], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44eb4d7a-1d41-4522-9137-a5d374fa895e", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 547.8666666666667, 281, 1987, 547.0, 1297.0000000000005, 1987.0, 1987.0, 0.07769444329341565, 6.309021474096673, 0.17341136715027142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb76b235-766e-4f3c-8c03-d713f9333335", 3, 0, 0.0, 1007.3333333333334, 257, 2269, 496.0, 2269.0, 2269.0, 2269.0, 0.01898229584540818, 0.022436431059465207, 0.012172891541488972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 580.6666666666667, 165, 1434, 480.0, 1119.4, 1405.1999999999996, 1434.0, 0.09339476633518937, 0.05736846486800206, 0.042228297669133476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 142.23076923076923, 138, 151, 143.0, 148.2, 151.0, 151.0, 0.0856632642975283, 0.06366185950236233, 0.042998943211845254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 269.6923076923077, 139, 433, 143.0, 431.0, 433.0, 433.0, 0.0856632642975283, 0.12189254449547632, 0.043320695256232], "isController": false}, {"data": ["login", 21, 0, 0.0, 2768.6190476190477, 1478, 5327, 2582.0, 4780.6, 5279.099999999999, 5327.0, 0.09252731758900247, 15.943600503668046, 0.161522645785601], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 164.73333333333332, 138, 424, 147.0, 261.4000000000001, 424.0, 424.0, 0.10982091868859181, 0.08890775546176034, 0.03903790469008536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=147dfd27-99a0-44af-9b94-62a177131c14", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1434.307692307692, 285, 2056, 1747.0, 2016.0, 2056.0, 2056.0, 0.08558318356276211, 78.79002479649306, 0.17563453964476394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e503b05-4a71-4736-9537-b1b5f49a92de", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da1610ad-5e7a-4200-89f5-a41c6557dcfa", 3, 0, 0.0, 422.3333333333333, 334, 483, 450.0, 483.0, 483.0, 483.0, 0.01719779180353243, 0.023708544364570254, 0.011028531853176718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 602.7058823529412, 281, 1760, 565.0, 1704.0, 1760.0, 1760.0, 0.09149081593662377, 13.002149403493334, 0.20301101488878484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa6e53ad-7659-4b20-8a35-2219a59764fc", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.7826861213235294, 1.4624502144607845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 981.2, 140, 1713, 1376.0, 1713.0, 1713.0, 1713.0, 0.05990176111177669, 43.00441026716185, 0.09691917754881994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab42d758-5b55-4a76-8cb1-6fc8f7b353a5", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1221.4285714285716, 356, 2641, 1264.0, 1814.6000000000004, 2565.299999999999, 2641.0, 0.09058635251894764, 0.02891484020136052, 0.04087001451538458], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 393.73333333333335, 281, 1610, 289.0, 975.8000000000004, 1610.0, 1610.0, 0.11616740497506274, 9.433141181151452, 0.2592817151536508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 148.52631578947367, 139, 173, 146.0, 166.0, 173.0, 173.0, 0.09537865325341606, 0.07404885677389236, 0.03390413064867524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa9ecb6e-3bf5-45be-8c90-42741d1c3081", 3, 0, 0.0, 584.0, 312, 968, 472.0, 968.0, 968.0, 968.0, 0.01825394893762017, 0.025164542236595516, 0.011705820119502518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 480.29411764705884, 279, 1764, 293.0, 906.3999999999992, 1764.0, 1764.0, 0.0868898543317148, 6.241474731663685, 0.19410957864809608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 147.0, 142, 159, 145.0, 159.0, 159.0, 159.0, 0.050156200739445704, 0.037274285901091976, 0.025176061699292082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21eeb484-2063-4024-90e9-06b8d494979e", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 143.99999999999997, 139, 148, 145.0, 148.0, 148.0, 148.0, 0.05015727889596664, 0.013420990642084822, 0.028605323120355974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 140.57142857142858, 138, 145, 140.0, 145.0, 145.0, 145.0, 0.050159794774782517, 0.0135196321853906, 0.02948847310001863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 182.42857142857142, 137, 422, 143.0, 422.0, 422.0, 422.0, 0.05015799769273211, 0.013519147815619201, 0.029536399031950645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 2.0200128424657535, 4.234000428082192], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1634.1551724137928, 1087, 3111, 1538.0, 2185.5, 2598.4999999999995, 3111.0, 0.25270459268812334, 302.32254718604725, 0.4989928578275248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1221.4285714285716, 356, 2641, 1264.0, 1814.6000000000004, 2565.299999999999, 2641.0, 0.09313588525658936, 0.029728641945741693, 0.042020291981000275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 209.58333333333331, 135, 414, 144.5, 412.2, 414.0, 414.0, 0.05742286195543986, 0.01547725576142715, 0.03381443921790062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 212.16666666666666, 139, 424, 145.0, 423.7, 424.0, 424.0, 0.057422587174665154, 0.015477181699421467, 0.03375820066323088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a61f6d6-8e96-4ee8-b204-a304ec6de700", 3, 0, 0.0, 495.66666666666663, 237, 785, 465.0, 785.0, 785.0, 785.0, 0.04964339494630239, 0.03191591960252189, 0.031835119806059804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 228.26315789473685, 136, 426, 143.0, 425.0, 426.0, 426.0, 0.09579316742628968, 0.02581925215786714, 0.056315905068971085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 183.4736842105263, 137, 415, 141.0, 414.0, 415.0, 415.0, 0.09579316742628968, 0.02581925215786714, 0.05640945308403582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 165.99999999999997, 138, 423, 143.0, 340.2000000000003, 423.0, 423.0, 0.05742203762100498, 0.015364881160307972, 0.0327485058307294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 157.42105263157893, 137, 416, 145.0, 147.0, 416.0, 416.0, 0.09579171855384755, 0.07118896271433396, 0.04808295247722426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 214.33333333333331, 138, 430, 146.5, 428.8, 430.0, 430.0, 0.057418740519926695, 0.042671544468422085, 0.02882151623754133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 170.21052631578948, 136, 423, 142.0, 417.0, 423.0, 423.0, 0.09579413336560083, 0.02563241459196741, 0.05463259168506922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 185.25000000000003, 144, 437, 153.5, 387.50000000000017, 437.0, 437.0, 0.05825666917493992, 0.04585437046386873, 0.020708425370779424], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 560.3636363636363, 141, 968, 514.0, 931.4000000000001, 968.0, 968.0, 0.07042118269175368, 0.013278994321491905, 0.04792691641645807], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28e26b81-57da-4990-8c98-f3cb558f5f08", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1567.5238095238094, 826, 2755, 1410.0, 2435.0, 2729.8999999999996, 2755.0, 0.09216225823864758, 0.04770116881492502, 0.042391038701565444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 452.3333333333333, 283, 849, 297.0, 846.0, 849.0, 849.0, 0.057379479185593926, 0.08892698580814215, 0.12904779351994417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e167bc1-ae6d-4ae1-8c09-9055c252553e", 3, 0, 0.0, 452.66666666666663, 252, 752, 354.0, 752.0, 752.0, 752.0, 0.03846055229353094, 0.02472642929027461, 0.024663830735109357], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1397.9473684210523, 727, 2831, 1139.0, 2340.4, 2642.7999999999993, 2831.0, 0.30008370756053004, 95.61721493363939, 1.0909961479386354], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7c376d2c-3964-43f1-b423-57e3ce254997", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 266.2413793103448, 137, 822, 146.0, 567.4, 595.2499999999999, 822.0, 0.25395713378724527, 0.18873181524618518, 0.1227624816647328], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 910.3620689655172, 674, 1298, 830.0, 1236.9, 1289.1, 1298.0, 0.25414296856514385, 74.72647109890544, 0.12781604376079012], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 214.81034482758625, 137, 444, 144.5, 423.1, 429.1, 444.0, 0.25476028375024706, 0.4508062833549294, 0.12389709112072564], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1366.2586206896558, 942, 2472, 1353.5, 1728.2, 2018.1499999999996, 2472.0, 0.2536561472255266, 228.24024715347508, 0.12732349577531313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 147.23529411764707, 138, 160, 146.0, 159.2, 160.0, 160.0, 0.08840537504680285, 0.0660450311628947, 0.0314253481611682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 207.47674418604657, 137, 1581, 149.0, 335.70000000000005, 431.44999999999993, 869.25000000001, 0.7487147788461957, 1.639373684579958, 0.35786362726192394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 188.57142857142858, 146, 420, 149.0, 420.0, 420.0, 420.0, 0.04984583395640626, 0.03860131477288102, 0.01771863628919129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2a792e6-2d83-49d4-963f-8dbe761c6269", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.4966344284603421, 0.9279621889580093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 145.41176470588232, 140, 152, 145.0, 149.6, 152.0, 152.0, 0.08956749437568821, 0.07268612092402042, 0.03183844526635792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/147dfd27-99a0-44af-9b94-62a177131c14", 3, 0, 0.0, 340.6666666666667, 232, 539, 251.0, 539.0, 539.0, 539.0, 0.03758221108675227, 0.03133074303163169, 0.02410057156279361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da1610ad-5e7a-4200-89f5-a41c6557dcfa", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44eb4d7a-1d41-4522-9137-a5d374fa895e", 3, 0, 0.0, 384.3333333333333, 255, 510, 388.0, 510.0, 510.0, 510.0, 0.08053691275167786, 0.03644085570469799, 0.05164639261744967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 333.42857142857144, 289, 568, 293.0, 568.0, 568.0, 568.0, 0.05010414504434217, 0.07765163885290138, 0.11268539652062501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 416.7368421052632, 278, 837, 290.0, 573.0, 837.0, 837.0, 0.09572318869055717, 0.14835224653507248, 0.21528369487729798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2115949-d860-4a88-8004-b686d73c9a48", 3, 0, 0.0, 350.0, 241, 523, 286.0, 523.0, 523.0, 523.0, 0.03664345914254306, 0.03054814416147551, 0.023498572431904237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 148.20000000000002, 139, 161, 148.0, 157.4, 161.0, 161.0, 0.07615450225417328, 0.06313981681034483, 0.027070545723163156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dadfa0aa-fd4c-4c4c-99ef-7f1bf5c7ba02", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b697ece-84ef-4c6c-819d-d0aa63dee810", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 148.38461538461542, 141, 173, 145.0, 169.8, 173.0, 173.0, 0.0802122539643364, 0.062274162013327576, 0.028512949651385205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/561d1f78-1040-4703-a875-9110db53451d", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.6129288627639156, 1.145258517274472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb76b235-766e-4f3c-8c03-d713f9333335", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa9ecb6e-3bf5-45be-8c90-42741d1c3081", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 142.7058823529412, 137, 147, 143.0, 147.0, 147.0, 147.0, 0.08713435605148104, 0.0647551220265401, 0.04373736231490356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab42d758-5b55-4a76-8cb1-6fc8f7b353a5", 3, 0, 0.0, 319.6666666666667, 244, 453, 262.0, 453.0, 453.0, 453.0, 0.027797596434494965, 0.02787903470529915, 0.017825932609360377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 173.41176470588235, 137, 421, 141.0, 415.4, 421.0, 421.0, 0.08713703580307029, 0.031014537789282145, 0.04926486134959891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 309.6470588235294, 136, 1620, 143.0, 670.3999999999992, 1620.0, 1620.0, 0.08701616453221134, 4.627797353748861, 0.05071610784373944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 270.29411764705884, 137, 816, 142.0, 600.7999999999998, 816.0, 816.0, 0.08695563216744585, 1.5260493658632648, 0.050765745043528966], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 21.428571428571427, 0.23166023166023167], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07722007722007722], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07722007722007722], "isController": false}, {"data": ["401/Unauthorized", 9, 64.28571428571429, 0.694980694980695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 14, "401/Unauthorized", 9, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
