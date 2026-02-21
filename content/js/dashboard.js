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

    var data = {"OkPercent": 68.66141732283465, "KoPercent": 31.338582677165356};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5232288037166086, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d04841a6-f1d5-4f8a-bd8c-25b200a9070a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e508b8fb-395d-423e-8f22-f25cf1ec26c7"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87c24ea5-a23c-45c2-b727-a9fad7154ea8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/073ee0ac-d93e-4ccd-aa29-b4f195880b41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c6edbc8-bf06-48a6-aef6-fb769fb23331"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073ee0ac-d93e-4ccd-aa29-b4f195880b41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e95361a1-b583-4360-93a0-8af88705c155"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87c24ea5-a23c-45c2-b727-a9fad7154ea8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff458689-0f04-4dfa-8754-fb08667c2098"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e508b8fb-395d-423e-8f22-f25cf1ec26c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4104e947-2594-4f45-a6e6-325d30022950"], "isController": false}, {"data": [0.9781420765027322, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fe06fda-2439-4e66-b86f-15e07e421943"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fe06fda-2439-4e66-b86f-15e07e421943"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2477c70f-d467-40ad-8481-f73a69e5e9ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e95361a1-b583-4360-93a0-8af88705c155"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76f90624-956f-4f77-a73d-889d6391bc6e"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ed57c51-0c0b-4fcc-8b5e-a6c6071334bb"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19f00f8e-5eae-454e-96aa-4888e0ed7238"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76f90624-956f-4f77-a73d-889d6391bc6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19f00f8e-5eae-454e-96aa-4888e0ed7238"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9377864-e5b8-452b-9cc8-0f6ab558be0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c6edbc8-bf06-48a6-aef6-fb769fb23331"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0850f460-1fa7-4934-a882-1b97642149e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98c0d0ab-bc80-4c2e-b1c6-bd88a0776bf4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b9377864-e5b8-452b-9cc8-0f6ab558be0c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d04841a6-f1d5-4f8a-bd8c-25b200a9070a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bfac2f44-4255-40cb-a2d3-dbab8888d478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98c0d0ab-bc80-4c2e-b1c6-bd88a0776bf4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0428adf2-1137-4837-a0d0-93fb307c37aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0428adf2-1137-4837-a0d0-93fb307c37aa"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3e63166-6de0-4d6e-948a-4e0e51d54456"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 635, 199, 31.338582677165356, 261.00944881889785, 98, 2242, 105.0, 641.1999999999995, 970.7999999999984, 1611.1999999999996, 2.5474078620628786, 2.6504888716387254, 1.2208941100720896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d04841a6-f1d5-4f8a-bd8c-25b200a9070a", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e508b8fb-395d-423e-8f22-f25cf1ec26c7", 3, 0, 0.0, 305.3333333333333, 195, 400, 321.0, 400.0, 400.0, 400.0, 0.021726063309748484, 0.02995113219947423, 0.013932403880274908], "isController": false}, {"data": ["see books", 59, 59, 100.0, 563.5762711864406, 403, 831, 605.0, 730.0, 737.0, 831.0, 0.2621744482116592, 1.6865850278393715, 0.44011511374593965], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 138.06250000000003, 98, 301, 101.5, 298.2, 301.0, 301.0, 0.1649212501030758, 0.08197745732662653, 0.08278273686814545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 117.17647058823529, 100, 297, 105.0, 162.59999999999988, 297.0, 297.0, 0.12258613478706068, 0.09517185269112621, 0.043575540100087976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87c24ea5-a23c-45c2-b727-a9fad7154ea8", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 112.6470588235294, 99, 299, 101.0, 143.79999999999987, 299.0, 299.0, 0.09379569091561146, 0.046623053394576404, 0.04708104016662529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073ee0ac-d93e-4ccd-aa29-b4f195880b41", 3, 0, 0.0, 763.0, 285, 1622, 382.0, 1622.0, 1622.0, 1622.0, 0.019553527782304056, 0.02311160787029493, 0.01253920889685514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c6edbc8-bf06-48a6-aef6-fb769fb23331", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.021055734529299056, 0.006209796706883119, 0.013015898395553028], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 181.0, 99, 521, 102.0, 405.0, 410.0, 521.0, 0.2733113757753473, 0.13585497096645682, 0.13211829200077824], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 504.4666666666667, 103, 1658, 443.0, 1196.0000000000002, 1658.0, 1658.0, 0.08103640155157697, 0.015874904444576503, 0.05456240005510475], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 504.4666666666667, 103, 1658, 443.0, 1196.0000000000002, 1658.0, 1658.0, 0.07970244420828905, 0.01561358428533475, 0.05366423684909671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, 16.666666666666668, 917.9166666666667, 114, 1635, 927.0, 1407.0, 1581.25, 1635.0, 0.0986971969996052, 0.03142117795104619, 0.04452939942755626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073ee0ac-d93e-4ccd-aa29-b4f195880b41", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 105.66666666666667, 102, 113, 103.0, 113.0, 113.0, 113.0, 0.029952076677316294, 0.023575560353434506, 0.010647027256389777], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 449.3571428571429, 100, 875, 398.0, 867.0, 875.0, 875.0, 0.08664331423054548, 0.019569688300677058, 0.057923376366179405], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1206.2608695652175, 689, 2242, 1112.0, 1743.6000000000001, 2152.3999999999987, 2242.0, 0.09556892597147891, 0.04946438551258186, 0.04395797278570954], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 258.26666666666665, 99, 1151, 191.0, 631.4000000000003, 1151.0, 1151.0, 0.08181163688723084, 0.1784676117956018, 0.05196317249165521], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 135.16666666666666, 101, 297, 102.0, 297.0, 297.0, 297.0, 0.02806308581691643, 0.013949326836728967, 0.01408635362294438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e95361a1-b583-4360-93a0-8af88705c155", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["addBook", 62, 62, 100.0, 626.6129032258066, 403, 1521, 559.5, 776.5000000000002, 922.3999999999995, 1521.0, 0.3036298458343944, 0.9688531484456111, 0.5945574350134185], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87c24ea5-a23c-45c2-b727-a9fad7154ea8", 3, 0, 0.0, 320.6666666666667, 186, 423, 353.0, 423.0, 423.0, 423.0, 0.0677032790954842, 0.04352668496535849, 0.04341649082620568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff458689-0f04-4dfa-8754-fb08667c2098", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e508b8fb-395d-423e-8f22-f25cf1ec26c7", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 116.41176470588235, 101, 298, 103.0, 153.9999999999999, 298.0, 298.0, 0.09758393653599987, 0.07290206196292959, 0.0346880399405312], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 508.57142857142867, 102, 933, 431.5, 906.5, 933.0, 933.0, 0.08713403704441346, 0.017164238324039037, 0.05918744787517427], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4104e947-2594-4f45-a6e6-325d30022950", 2, 0, 0.0, 195.5, 195, 196, 195.5, 196.0, 196.0, 196.0, 0.022693232877955796, 0.02581798467072119, 0.014105705787909045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 3, 1.639344262295082, 173.44262295081964, 100, 1200, 107.0, 303.6, 395.5999999999997, 951.359999999999, 0.7594400893068345, 1.6285984245249348, 0.3659490329588699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 120.9090909090909, 101, 304, 102.0, 264.20000000000016, 304.0, 304.0, 0.0573543980395224, 0.04441605238802857, 0.020387696178111477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fe06fda-2439-4e66-b86f-15e07e421943", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fe06fda-2439-4e66-b86f-15e07e421943", 3, 0, 0.0, 665.6666666666666, 389, 1151, 457.0, 1151.0, 1151.0, 1151.0, 0.03473307630856865, 0.02823193084065622, 0.022273489690065183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2477c70f-d467-40ad-8481-f73a69e5e9ac", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e95361a1-b583-4360-93a0-8af88705c155", 3, 0, 0.0, 261.6666666666667, 186, 391, 208.0, 391.0, 391.0, 391.0, 0.01942112111658499, 0.026773583310135882, 0.012454299674372536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 166.35294117647058, 100, 423, 102.0, 323.7999999999999, 423.0, 423.0, 0.08389096148911392, 0.041699706443319315, 0.042109330278715384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 143.3125, 100, 314, 103.0, 304.2, 314.0, 314.0, 0.09506720062744352, 0.07714926144668513, 0.03379341897303657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76f90624-956f-4f77-a73d-889d6391bc6e", 3, 0, 0.0, 277.6666666666667, 192, 355, 286.0, 355.0, 355.0, 355.0, 0.031652915233493006, 0.026387733044588406, 0.020298256188144927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 486.304347826087, 105, 1087, 385.0, 999.8000000000002, 1076.9999999999998, 1087.0, 0.09883885828226659, 0.06071254087846258, 0.04468983533661077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ed57c51-0c0b-4fcc-8b5e-a6c6071334bb", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["login", 23, 4, 17.391304347826086, 2032.9565217391298, 1314, 2918, 1909.0, 2846.0, 2915.2, 2918.0, 0.09862059798385195, 0.14616383293241916, 0.14819470037561583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19f00f8e-5eae-454e-96aa-4888e0ed7238", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, 100.0, 136.63636363636365, 99, 297, 102.0, 296.8, 297.0, 297.0, 0.05801289995939097, 0.02883649031184571, 0.029119756424928672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76f90624-956f-4f77-a73d-889d6391bc6e", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 118.31249999999999, 101, 310, 103.5, 177.00000000000014, 310.0, 310.0, 0.1670773986049037, 0.135260901800259, 0.05939079403533687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 115.29411764705883, 98, 334, 101.0, 153.19999999999985, 334.0, 334.0, 0.11743900080134848, 0.05837544082801404, 0.05894887344911437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19f00f8e-5eae-454e-96aa-4888e0ed7238", 3, 0, 0.0, 406.6666666666667, 182, 632, 406.0, 632.0, 632.0, 632.0, 0.019735673545645323, 0.027207219227151025, 0.012656014610976983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9377864-e5b8-452b-9cc8-0f6ab558be0c", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 105.52941176470587, 100, 126, 102.0, 120.39999999999999, 126.0, 126.0, 0.08834519064372463, 0.07324713560207248, 0.03140395448663649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c6edbc8-bf06-48a6-aef6-fb769fb23331", 3, 0, 0.0, 280.3333333333333, 191, 396, 254.0, 396.0, 396.0, 396.0, 0.04854054753737622, 0.0312068949825254, 0.031127890185101287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 21, 100.0, 101.47619047619048, 99, 104, 101.0, 104.0, 104.0, 104.0, 0.10067500191761908, 0.05004255466412901, 0.05053413182192989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 113.95238095238095, 101, 303, 104.0, 110.0, 283.6999999999997, 303.0, 0.10183200628448953, 0.07905902831657145, 0.03619809598393964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0850f460-1fa7-4934-a882-1b97642149e1", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98c0d0ab-bc80-4c2e-b1c6-bd88a0776bf4", 3, 0, 0.0, 455.66666666666663, 213, 875, 279.0, 875.0, 875.0, 875.0, 0.036837387492479036, 0.030158212742052336, 0.02362293403651813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9377864-e5b8-452b-9cc8-0f6ab558be0c", 3, 0, 0.0, 646.3333333333334, 268, 859, 812.0, 859.0, 859.0, 859.0, 0.02919310264294889, 0.024337088498890665, 0.01872083730683897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d04841a6-f1d5-4f8a-bd8c-25b200a9070a", 3, 0, 0.0, 312.3333333333333, 189, 558, 190.0, 558.0, 558.0, 558.0, 0.019896801920704612, 0.0274293476999297, 0.012759342377535185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfac2f44-4255-40cb-a2d3-dbab8888d478", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.6310986907114624, 1.1792088685770752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98c0d0ab-bc80-4c2e-b1c6-bd88a0776bf4", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 126.06250000000003, 99, 300, 101.0, 300.0, 300.0, 300.0, 0.09543179906834706, 0.047436314185340486, 0.047902289766728896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, 100.0, 100.62499999999999, 99, 102, 100.0, 102.0, 102.0, 102.0, 0.049817543247854736, 0.024762821790193415, 0.028399405147397652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0428adf2-1137-4837-a0d0-93fb307c37aa", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0428adf2-1137-4837-a0d0-93fb307c37aa", 3, 0, 0.0, 266.6666666666667, 176, 429, 195.0, 429.0, 429.0, 429.0, 0.04967709885742673, 0.03193758796986256, 0.0318567333167743], "isController": false}, {"data": ["register", 24, 4, 16.666666666666668, 917.9166666666667, 114, 1635, 927.0, 1407.0, 1581.25, 1635.0, 0.10057116038166755, 0.03201777176213244, 0.045374879000322665], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c3e63166-6de0-4d6e-948a-4e0e51d54456", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.0100502512562812, 0.6299212598425197], "isController": false}, {"data": ["401/Unauthorized", 7, 3.5175879396984926, 1.1023622047244095], "isController": false}, {"data": ["404/Not Found", 188, 94.47236180904522, 29.606299212598426], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 635, 199, "404/Not Found", 188, "401/Unauthorized", 7, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
