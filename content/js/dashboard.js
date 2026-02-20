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

    var data = {"OkPercent": 67.93388429752066, "KoPercent": 32.06611570247934};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5139902676399026, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d64ddebe-38c5-4b8f-8bca-9238a95ae95f"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79247796-aaec-45b9-b783-b259cf95cb12"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be304b5e-b61a-4011-8187-a056f7dc99f3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d64ddebe-38c5-4b8f-8bca-9238a95ae95f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27673280-0758-4bff-8d30-c428797b7e4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8834962e-4ba3-46ee-b7be-ed1046100515"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4409ddb7-9d4d-4d00-8971-9f5d1a95ded6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/658bab9e-e2b3-454c-863f-4041cb603603"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79247796-aaec-45b9-b783-b259cf95cb12"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8834962e-4ba3-46ee-b7be-ed1046100515"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/382c15b2-f083-417b-9060-293c94f35de7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04120646-3646-48ce-a09e-aff3f3743148"], "isController": false}, {"data": [0.9505813953488372, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=382c15b2-f083-417b-9060-293c94f35de7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04120646-3646-48ce-a09e-aff3f3743148"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d52def1-a477-4c42-925d-f364ce458651"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a1899bb-51ed-4dec-a36c-8a16ea0b226e"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d544ae68-251f-4b5a-bfb5-bade6b6daa1e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27673280-0758-4bff-8d30-c428797b7e4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4409ddb7-9d4d-4d00-8971-9f5d1a95ded6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d544ae68-251f-4b5a-bfb5-bade6b6daa1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7551d176-f4eb-4009-b76a-de3fb67847ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/197542a2-3463-445b-93c8-2167cfda381f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d52def1-a477-4c42-925d-f364ce458651"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c1f21bc-3cf2-413e-8946-b089775e9732"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3d84569-679b-4ce2-8ddf-a07f0b67abd3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7551d176-f4eb-4009-b76a-de3fb67847ed"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=197542a2-3463-445b-93c8-2167cfda381f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3d84569-679b-4ce2-8ddf-a07f0b67abd3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a1899bb-51ed-4dec-a36c-8a16ea0b226e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 605, 194, 32.06611570247934, 275.7520661157026, 99, 1748, 109.0, 707.3999999999999, 1076.2999999999975, 1406.8199999999997, 2.3792950207844203, 2.47479019558395, 1.141402572293208], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d64ddebe-38c5-4b8f-8bca-9238a95ae95f", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["see books", 56, 56, 100.0, 604.9107142857143, 408, 1336, 610.5, 743.3, 865.1999999999995, 1336.0, 0.24450198002942755, 1.5734613157481105, 0.4104481481158066], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 22, 100.0, 135.31818181818184, 99, 305, 102.0, 300.2, 304.55, 305.0, 0.10198547170598515, 0.05069395029135395, 0.051191926227418326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 134.75, 102, 315, 104.0, 307.3, 315.0, 315.0, 0.07372864173409764, 0.05724049822129652, 0.026208228116417525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79247796-aaec-45b9-b783-b259cf95cb12", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 141.66666666666669, 100, 305, 101.0, 303.8, 305.0, 305.0, 0.11061212751366059, 0.054982004789505115, 0.055522103068380416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be304b5e-b61a-4011-8187-a056f7dc99f3", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 2.7562792056074765, 5.777234228971963], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 206.0892857142857, 100, 692, 104.0, 410.0, 451.5999999999996, 692.0, 0.25032743722816003, 0.12443033745032565, 0.1210078920194719], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 638.6428571428572, 103, 1748, 499.0, 1377.0, 1748.0, 1748.0, 0.09001768204468734, 0.016997618951936987, 0.06087621564057225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 638.6428571428572, 103, 1748, 499.0, 1377.0, 1748.0, 1748.0, 0.09097170779887455, 0.01717776318439965, 0.061521394190156856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 962.1249999999998, 206, 1485, 942.0, 1432.5, 1483.25, 1485.0, 0.09621590849867101, 0.030067471405834694, 0.04340991184217384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d64ddebe-38c5-4b8f-8bca-9238a95ae95f", 3, 0, 0.0, 375.66666666666663, 176, 680, 271.0, 680.0, 680.0, 680.0, 0.01860176716788095, 0.02564403774608588, 0.011928867617423655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27673280-0758-4bff-8d30-c428797b7e4f", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 108.0, 101, 142, 105.0, 135.60000000000002, 142.0, 142.0, 0.05856920750537772, 0.046100372313803165, 0.020819522980427236], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 509.7857142857143, 109, 1118, 464.0, 899.0, 1118.0, 1118.0, 0.0912379028316335, 0.018545427514744698, 0.061548671755352086], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1158.9565217391307, 746, 1655, 1183.0, 1506.0000000000002, 1638.7999999999997, 1655.0, 0.09892770965147338, 0.051202818471953994, 0.04550288207601949], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 221.2857142857143, 101, 337, 202.0, 325.5, 337.0, 337.0, 0.09032199792259406, 0.2080001701601925, 0.057843628831426894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8834962e-4ba3-46ee-b7be-ed1046100515", 3, 0, 0.0, 487.6666666666667, 199, 857, 407.0, 857.0, 857.0, 857.0, 0.03204820049354229, 0.026717266101550067, 0.020551743155038514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4409ddb7-9d4d-4d00-8971-9f5d1a95ded6", 3, 0, 0.0, 277.3333333333333, 190, 422, 220.0, 422.0, 422.0, 422.0, 0.01969615399766272, 0.027152738339876834, 0.012630671671678244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 11, 100.0, 125.72727272727272, 100, 328, 101.0, 289.20000000000016, 328.0, 328.0, 0.059147416870994104, 0.029400424987632814, 0.029689230734073212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/658bab9e-e2b3-454c-863f-4041cb603603", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79247796-aaec-45b9-b783-b259cf95cb12", 3, 0, 0.0, 297.6666666666667, 204, 397, 292.0, 397.0, 397.0, 397.0, 0.020741580646722487, 0.020802346996273428, 0.013301078735040136], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 675.9137931034484, 412, 1362, 630.0, 973.7, 1299.7, 1362.0, 0.2671949140830147, 0.8587424635486249, 0.5227873281084443], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8834962e-4ba3-46ee-b7be-ed1046100515", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/382c15b2-f083-417b-9060-293c94f35de7", 3, 0, 0.0, 359.6666666666667, 215, 599, 265.0, 599.0, 599.0, 599.0, 0.04359831419851766, 0.028540432894928063, 0.027958554352565033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 130.66666666666666, 102, 300, 105.0, 299.4, 300.0, 300.0, 0.11638191890507892, 0.08694547652576697, 0.04137013523578977], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 464.7857142857143, 107, 995, 462.5, 876.5, 995.0, 995.0, 0.09062075215224287, 0.01711149386691695, 0.062017313013787295], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04120646-3646-48ce-a09e-aff3f3743148", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 5, 2.9069767441860463, 189.01162790697674, 100, 993, 110.0, 357.1, 444.64999999999975, 892.2600000000014, 0.7137640262930748, 1.5445651226678176, 0.3430750430022077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 116.4, 102, 132, 118.0, 132.0, 132.0, 132.0, 0.024136865683169847, 0.0186919282097204, 0.008579901473314281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=382c15b2-f083-417b-9060-293c94f35de7", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 11, 100.0, 104.36363636363637, 100, 128, 102.0, 123.40000000000002, 128.0, 128.0, 0.053782893128502, 0.02673387949453859, 0.026996491277392603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04120646-3646-48ce-a09e-aff3f3743148", 3, 0, 0.0, 303.0, 222, 373, 314.0, 373.0, 373.0, 373.0, 0.028981027087599986, 0.029065932440395688, 0.018584838334170562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 118.82352941176472, 102, 299, 105.0, 158.9999999999999, 299.0, 299.0, 0.09925442411999276, 0.08054729144893945, 0.03528184607390368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d52def1-a477-4c42-925d-f364ce458651", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a1899bb-51ed-4dec-a36c-8a16ea0b226e", 3, 0, 0.0, 381.0, 186, 557, 400.0, 557.0, 557.0, 557.0, 0.018345145568730088, 0.02529026415480857, 0.01176430233411402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 556.4347826086956, 122, 1407, 517.0, 1335.0000000000002, 1400.6, 1407.0, 0.09891069224583177, 0.06075666545178534, 0.044722314950996205], "isController": false}, {"data": ["login", 23, 7, 30.434782608695652, 1955.5652173913043, 1146, 2927, 1881.0, 2695.8, 2886.1999999999994, 2927.0, 0.09923031788216616, 0.14936791905394678, 0.1486558808524316], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d544ae68-251f-4b5a-bfb5-bade6b6daa1e", 3, 0, 0.0, 306.3333333333333, 186, 513, 220.0, 513.0, 513.0, 513.0, 0.02570870325300792, 0.025784021719569467, 0.016486375458471876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, 100.0, 141.2, 101, 297, 102.0, 297.0, 297.0, 297.0, 0.023308827985511232, 0.011586126410766813, 0.011699939047414818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 154.5, 100, 437, 106.5, 308.5, 417.9499999999997, 437.0, 0.09780472841405187, 0.07917980454614161, 0.0347665245534325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 118.06249999999999, 100, 307, 101.5, 205.5000000000001, 307.0, 307.0, 0.0731518861756651, 0.03636163092130228, 0.0367188178655194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27673280-0758-4bff-8d30-c428797b7e4f", 3, 0, 0.0, 385.0, 203, 648, 304.0, 648.0, 648.0, 648.0, 0.015810110038365865, 0.02179551302489565, 0.010138644783717694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4409ddb7-9d4d-4d00-8971-9f5d1a95ded6", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d544ae68-251f-4b5a-bfb5-bade6b6daa1e", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7551d176-f4eb-4009-b76a-de3fb67847ed", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 127.27272727272728, 101, 305, 103.0, 273.60000000000014, 305.0, 305.0, 0.053861898093288806, 0.04465698386836152, 0.019146221587848757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 101.82352941176471, 100, 106, 101.0, 106.0, 106.0, 106.0, 0.09244807952710088, 0.04595319578056089, 0.04640460241887681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/197542a2-3463-445b-93c8-2167cfda381f", 3, 0, 0.0, 334.0, 201, 506, 295.0, 506.0, 506.0, 506.0, 0.07554962351104284, 0.03418423720063461, 0.04844816351456848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 128.47058823529412, 101, 494, 104.0, 193.19999999999973, 494.0, 494.0, 0.08958070958460898, 0.06954752355445717, 0.031843142860153974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d52def1-a477-4c42-925d-f364ce458651", 3, 0, 0.0, 305.0, 176, 410, 329.0, 410.0, 410.0, 410.0, 0.0844713501337463, 0.038221086160777136, 0.05416945304800788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c1f21bc-3cf2-413e-8946-b089775e9732", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3d84569-679b-4ce2-8ddf-a07f0b67abd3", 3, 0, 0.0, 360.0, 337, 398, 345.0, 398.0, 398.0, 398.0, 0.05267038870746866, 0.03420489110397135, 0.0337762583833702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7551d176-f4eb-4009-b76a-de3fb67847ed", 3, 0, 0.0, 515.0, 185, 1118, 242.0, 1118.0, 1118.0, 1118.0, 0.019577006153705598, 0.023139358510450857, 0.012554265013932302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 128.1764705882353, 99, 300, 102.0, 300.0, 300.0, 300.0, 0.10049063072648814, 0.04995090921853757, 0.05044158612638175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, 100.0, 103.33333333333333, 100, 116, 101.0, 116.0, 116.0, 116.0, 0.08775094332264072, 0.04361838881955481, 0.049607466874018895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=197542a2-3463-445b-93c8-2167cfda381f", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3d84569-679b-4ce2-8ddf-a07f0b67abd3", 1, 0, 0.0, 995.0, 995, 995, 995.0, 995.0, 995.0, 995.0, 1.0050251256281408, 0.18157192211055276, 0.6929177135678392], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 962.1249999999998, 206, 1485, 942.0, 1432.5, 1483.25, 1485.0, 0.09745361816860289, 0.0304542556776884, 0.04396833163466263], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a1899bb-51ed-4dec-a36c-8a16ea0b226e", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 4.123711340206185, 1.322314049586777], "isController": false}, {"data": ["401/Unauthorized", 7, 3.6082474226804124, 1.1570247933884297], "isController": false}, {"data": ["404/Not Found", 179, 92.26804123711341, 29.58677685950413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 605, 194, "404/Not Found", 179, "406/Not Acceptable", 8, "401/Unauthorized", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
