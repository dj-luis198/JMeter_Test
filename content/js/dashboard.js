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

    var data = {"OkPercent": 68.87096774193549, "KoPercent": 31.129032258064516};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5170387779083431, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bad216b-6ba4-436c-a8ef-ee378191bd89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71e3fb60-fe3e-483a-b8d1-13a4436b0ff7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f1fead4-17d0-465b-a138-50e0f942ea5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cab058d3-463f-41df-a52b-6bbabfe7313d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d297c5d2-4e23-4d70-acb5-93a5520e04a8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29ee0581-ba9a-4e80-919b-bfd4def6b96b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/71e3fb60-fe3e-483a-b8d1-13a4436b0ff7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29ee0581-ba9a-4e80-919b-bfd4def6b96b"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e603d65-37ff-4c30-9515-4e737305ac4a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b945aef9-f231-447a-a9c4-921906cfa18e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d297c5d2-4e23-4d70-acb5-93a5520e04a8"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0911b95f-e941-4d1e-becc-bbba949255d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cab058d3-463f-41df-a52b-6bbabfe7313d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1761b262-7819-4813-a903-adbb4b7e9360"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b945aef9-f231-447a-a9c4-921906cfa18e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1761b262-7819-4813-a903-adbb4b7e9360"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beccb585-8350-436c-84bd-e89fd7e1db8a"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bb93162-333b-4c3b-ab33-50ada84aa2a2"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=340003cd-bc80-4735-a0df-153ad88d0be8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/beccb585-8350-436c-84bd-e89fd7e1db8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf094b7e-0a8a-4f60-9020-148b5dec7863"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1a94ae2-69ce-4552-88fa-49a506a49ad7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6bb93162-333b-4c3b-ab33-50ada84aa2a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21a06371-acdc-439b-8ab9-b774f59b3a7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21a06371-acdc-439b-8ab9-b774f59b3a7f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e603d65-37ff-4c30-9515-4e737305ac4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4f29b2b-c4bd-4e4d-ab46-3719a36d6e52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4f29b2b-c4bd-4e4d-ab46-3719a36d6e52"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bad216b-6ba4-436c-a8ef-ee378191bd89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f1fead4-17d0-465b-a138-50e0f942ea5b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/340003cd-bc80-4735-a0df-153ad88d0be8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bae74097-ee2e-4efa-9d79-67f0e3f760bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1644a3f-e2e5-4a71-90c9-fdd1798b2270"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bae74097-ee2e-4efa-9d79-67f0e3f760bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1644a3f-e2e5-4a71-90c9-fdd1798b2270"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 620, 193, 31.129032258064516, 297.9258064516132, 101, 2235, 116.0, 757.8999999999997, 1033.5999999999995, 1531.0099999999993, 2.392132200028551, 2.5025640968447007, 1.1521028337120875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 60, 100.0, 604.0166666666667, 415, 922, 645.0, 779.6, 845.5999999999998, 922.0, 0.285442435775452, 1.8362394817435777, 0.4791753389628925], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 21, 100.0, 147.57142857142856, 102, 320, 108.0, 319.0, 319.9, 320.0, 0.11473340872957336, 0.05703057133139926, 0.05759079305371163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 169.45454545454547, 104, 328, 115.0, 328.0, 328.0, 328.0, 0.07154518078166362, 0.055545330782639235, 0.025432075980981992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bad216b-6ba4-436c-a8ef-ee378191bd89", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71e3fb60-fe3e-483a-b8d1-13a4436b0ff7", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f1fead4-17d0-465b-a138-50e0f942ea5b", 3, 0, 0.0, 526.6666666666666, 193, 952, 435.0, 952.0, 952.0, 952.0, 0.026011861408802413, 0.03074513957531301, 0.016680783520618737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cab058d3-463f-41df-a52b-6bbabfe7313d", 1, 0, 0.0, 973.0, 973, 973, 973.0, 973.0, 973.0, 973.0, 1.027749229188078, 0.18567735097636176, 0.7085849177800617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 109.05555555555554, 105, 120, 109.0, 112.80000000000001, 120.0, 120.0, 0.10318970854640097, 0.05129254067394345, 0.05179639667270517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d297c5d2-4e23-4d70-acb5-93a5520e04a8", 3, 0, 0.0, 650.0, 188, 1535, 227.0, 1535.0, 1535.0, 1535.0, 0.04512160271932859, 0.0290088428940996, 0.028935402785506943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ee0581-ba9a-4e80-919b-bfd4def6b96b", 3, 0, 0.0, 835.3333333333334, 226, 1883, 397.0, 1883.0, 1883.0, 1883.0, 0.04905166775670373, 0.031535496034990194, 0.03145565933616743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71e3fb60-fe3e-483a-b8d1-13a4436b0ff7", 3, 0, 0.0, 1535.3333333333333, 881, 2235, 1490.0, 2235.0, 2235.0, 2235.0, 0.06943801499861123, 0.031418893505231, 0.04452893539950004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 210.38333333333335, 102, 574, 111.0, 434.8, 447.59999999999997, 574.0, 0.27310713993099495, 0.13575345139148087, 0.13201956471273682], "isController": false}, {"data": ["deleteBook", 17, 1, 5.882352941176471, 578.0, 117, 1026, 537.0, 944.4, 1026.0, 1026.0, 0.08537608163962254, 0.01599820647452026, 0.057788739083161324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 1, 5.882352941176471, 578.0, 117, 1026, 537.0, 944.4, 1026.0, 1026.0, 0.08604762989395895, 0.01612404461822691, 0.05824329176473566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29ee0581-ba9a-4e80-919b-bfd4def6b96b", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 5, 19.23076923076923, 1017.076923076923, 453, 2143, 964.0, 1500.6, 1923.549999999999, 2143.0, 0.10175567679266107, 0.032303146794304814, 0.04590929949043888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 134.22222222222223, 104, 323, 110.0, 323.0, 323.0, 323.0, 0.04753579709609097, 0.037415871542430985, 0.016897490374001088], "isController": false}, {"data": ["deleteAccount", 17, 1, 5.882352941176471, 601.4705882352941, 107, 1535, 419.0, 1499.0, 1535.0, 1535.0, 0.08433878393395776, 0.016806711940883474, 0.05698487917228925], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1186.0454545454543, 737, 2161, 1181.5, 1499.1, 2063.1999999999985, 2161.0, 0.09335800247823062, 0.048320059876427957, 0.04294103434301428], "isController": false}, {"data": ["goToProfile", 17, 1, 5.882352941176471, 348.64705882352933, 111, 2235, 226.0, 769.3999999999987, 2235.0, 2235.0, 0.08454178353324979, 0.1539993081249627, 0.05423242743082493], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 107.88888888888889, 104, 111, 108.0, 111.0, 111.0, 111.0, 0.04806511220533416, 0.023891740344253013, 0.024126433274943123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e603d65-37ff-4c30-9515-4e737305ac4a", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b945aef9-f231-447a-a9c4-921906cfa18e", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 0.2415294953208556, 0.9217287767379679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d297c5d2-4e23-4d70-acb5-93a5520e04a8", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["addBook", 55, 55, 100.0, 712.4363636363638, 418, 2046, 662.0, 968.4, 1161.999999999999, 2046.0, 0.25299220783999854, 0.8335221790793844, 0.4945611347045511], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0911b95f-e941-4d1e-becc-bbba949255d4", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cab058d3-463f-41df-a52b-6bbabfe7313d", 3, 0, 0.0, 296.6666666666667, 212, 419, 259.0, 419.0, 419.0, 419.0, 0.04917710314077766, 0.03219243307815881, 0.031536098042751294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 145.83333333333331, 105, 321, 112.0, 320.1, 321.0, 321.0, 0.09815308609661536, 0.07332725670303784, 0.03489035482340624], "isController": false}, {"data": ["deleteBooks", 17, 1, 5.882352941176471, 463.3529411764706, 111, 973, 421.0, 819.3999999999999, 973.0, 973.0, 0.08635534717389427, 0.016181706254667, 0.05917583504350786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 192.47647058823532, 102, 1724, 116.0, 335.8, 465.4999999999999, 1202.1499999999942, 0.7172178696941699, 1.6429884240508466, 0.3401799623566092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1761b262-7819-4813-a903-adbb4b7e9360", 3, 0, 0.0, 340.6666666666667, 189, 461, 372.0, 461.0, 461.0, 461.0, 0.020311167079660398, 0.024007111870523082, 0.01302506482647493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 111.5, 103, 137, 109.5, 137.0, 137.0, 137.0, 0.044300222608618614, 0.03430671535999468, 0.015747344755407396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b945aef9-f231-447a-a9c4-921906cfa18e", 3, 0, 0.0, 311.3333333333333, 240, 390, 304.0, 390.0, 390.0, 390.0, 0.03812670775878503, 0.02416429036665184, 0.02444974423333545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1761b262-7819-4813-a903-adbb4b7e9360", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 107.75, 101, 116, 107.5, 115.10000000000001, 116.0, 116.0, 0.05430380262377873, 0.02699280814014001, 0.02725796342638893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 116.88235294117646, 107, 176, 113.0, 132.79999999999995, 176.0, 176.0, 0.08524037786558093, 0.06917456445927515, 0.030300290569405725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beccb585-8350-436c-84bd-e89fd7e1db8a", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 615.7272727272727, 181, 1473, 544.5, 1290.7999999999997, 1462.9499999999998, 1473.0, 0.09514994766752878, 0.05844659871374571, 0.04302190016607991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bb93162-333b-4c3b-ab33-50ada84aa2a2", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["login", 22, 3, 13.636363636363637, 2226.8181818181815, 1153, 3177, 2190.0, 3123.9, 3175.2, 3177.0, 0.09465215333648841, 0.1396505802822355, 0.1423563680462935], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 131.875, 103, 304, 108.0, 304.0, 304.0, 304.0, 0.044606514781483836, 0.02217257424196804, 0.022390379489924502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=340003cd-bc80-4735-a0df-153ad88d0be8", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beccb585-8350-436c-84bd-e89fd7e1db8a", 3, 0, 0.0, 320.6666666666667, 201, 548, 213.0, 548.0, 548.0, 548.0, 0.03891403888809619, 0.024663292224975028, 0.02495464082342106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 164.7619047619048, 105, 337, 114.0, 333.0, 336.7, 337.0, 0.11115639705065027, 0.089988919096669, 0.039512625514098336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf094b7e-0a8a-4f60-9020-148b5dec7863", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.6942085597826086, 1.2971297554347825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 11, 100.0, 107.18181818181819, 104, 111, 107.0, 110.8, 111.0, 111.0, 0.07350926550878435, 0.036539273578096915, 0.036898205538589024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1a94ae2-69ce-4552-88fa-49a506a49ad7", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bb93162-333b-4c3b-ab33-50ada84aa2a2", 3, 0, 0.0, 494.66666666666663, 204, 981, 299.0, 981.0, 981.0, 981.0, 0.015425512769753656, 0.02126531464189672, 0.009892011769666243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21a06371-acdc-439b-8ab9-b774f59b3a7f", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21a06371-acdc-439b-8ab9-b774f59b3a7f", 3, 0, 0.0, 307.0, 185, 471, 265.0, 471.0, 471.0, 471.0, 0.044485964678144044, 0.028600188879991696, 0.028527783338523363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e603d65-37ff-4c30-9515-4e737305ac4a", 3, 0, 0.0, 376.66666666666663, 201, 664, 265.0, 664.0, 664.0, 664.0, 0.02275002275002275, 0.02281667320729821, 0.014589044536961204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4f29b2b-c4bd-4e4d-ab46-3719a36d6e52", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 130.25, 107, 319, 110.5, 262.0000000000002, 319.0, 319.0, 0.05368406925244934, 0.044509545698563954, 0.0190830089920816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4f29b2b-c4bd-4e4d-ab46-3719a36d6e52", 3, 0, 0.0, 420.3333333333333, 239, 659, 363.0, 659.0, 659.0, 659.0, 0.033616458618139444, 0.02752128692207705, 0.021557429517491764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 119.6842105263158, 102, 330, 108.0, 112.0, 330.0, 330.0, 0.09648147301819437, 0.047958075943614197, 0.04842917688608585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bad216b-6ba4-436c-a8ef-ee378191bd89", 3, 0, 0.0, 434.0, 381, 518, 403.0, 518.0, 518.0, 518.0, 0.08109642364771714, 0.03811954288649204, 0.052005193550131106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 134.1578947368421, 102, 327, 112.0, 312.0, 327.0, 327.0, 0.09239492508716732, 0.07173238812919729, 0.032843508527079006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f1fead4-17d0-465b-a138-50e0f942ea5b", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/340003cd-bc80-4735-a0df-153ad88d0be8", 3, 0, 0.0, 490.66666666666663, 181, 945, 346.0, 945.0, 945.0, 945.0, 0.020262192774502058, 0.024305397257174507, 0.012993658777919614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 123.47058823529412, 106, 324, 110.0, 167.99999999999986, 324.0, 324.0, 0.0847892985929964, 0.04214624314827653, 0.04256025339531264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, 100.0, 108.0, 103, 111, 109.0, 111.0, 111.0, 111.0, 0.03901860407042078, 0.019394989718597825, 0.022176589422836807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bae74097-ee2e-4efa-9d79-67f0e3f760bb", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1644a3f-e2e5-4a71-90c9-fdd1798b2270", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bae74097-ee2e-4efa-9d79-67f0e3f760bb", 3, 0, 0.0, 327.6666666666667, 193, 425, 365.0, 425.0, 425.0, 425.0, 0.1465416178194607, 0.06630626587534193, 0.09397362861469323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1644a3f-e2e5-4a71-90c9-fdd1798b2270", 3, 0, 0.0, 271.3333333333333, 220, 362, 232.0, 362.0, 362.0, 362.0, 0.03496421994825295, 0.029148231538891865, 0.022421716568378356], "isController": false}, {"data": ["register", 26, 5, 19.23076923076923, 1017.076923076923, 453, 2143, 964.0, 1500.6, 1923.549999999999, 2143.0, 0.10518735486167863, 0.033392560219760656, 0.047457576119233916], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5906735751295336, 0.8064516129032258], "isController": false}, {"data": ["401/Unauthorized", 8, 4.1450777202072535, 1.2903225806451613], "isController": false}, {"data": ["404/Not Found", 180, 93.26424870466322, 29.032258064516128], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 620, 193, "404/Not Found", 180, "401/Unauthorized", 8, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
